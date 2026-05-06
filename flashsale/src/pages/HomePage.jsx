import { useEffect, useMemo, useState } from 'react'
import Cart from '../components/Cart'
import Header from '../components/Header'
import ProductList from '../components/ProductList'
import { cartService } from '../services/cartService'
import { inventoryService } from '../services/inventoryService'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

const normalizeProduct = (product) => {
  const id = product.id ?? product.productId ?? product._id
  const price = Number(product.price ?? product.salePrice ?? product.amount ?? 0)

  return {
    ...product,
    id,
    name: product.name ?? product.productName ?? product.title ?? `Sản phẩm ${id}`,
    price,
    stock: product.stock ?? product.quantity ?? product.availableStock,
    formattedPrice: currencyFormatter.format(price),
  }
}

const normalizeStock = (payload) => {
  if (typeof payload === 'number') return payload
  return payload?.stock ?? payload?.quantity ?? payload?.availableStock ?? payload?.data?.stock
}

const normalizeCartItem = (item, index) => {
  const product = item.product ?? {}
  const productId = item.productId ?? product.id ?? product.productId ?? item.id
  const quantity = Number(item.quantity ?? item.qty ?? 1)
  const price = Number(item.price ?? product.price ?? item.unitPrice ?? 0)
  const lineTotal = Number(item.total ?? item.lineTotal ?? price * quantity)

  return {
    key: `${productId || 'item'}-${index}`,
    productId,
    name: item.name ?? product.name ?? item.productName ?? `Sản phẩm ${productId}`,
    quantity,
    price,
    lineTotal,
    formattedLineTotal: currencyFormatter.format(lineTotal),
  }
}

function HomePage() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [stockById, setStockById] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCart, setLoadingCart] = useState(true)
  const [addingProductId, setAddingProductId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const cartTotal = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
    return currencyFormatter.format(total)
  }, [cartItems])

  const loadStocks = async (nextProducts) => {
    const stockEntries = await Promise.all(
      nextProducts.map(async (product) => {
        try {
          const stockPayload = await inventoryService.getStock(product.id)
          return [product.id, normalizeStock(stockPayload)]
        } catch {
          return [product.id, product.stock]
        }
      }),
    )

    setStockById(Object.fromEntries(stockEntries))
  }

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const payload = await productService.getProducts()
      const nextProducts = getArrayPayload(payload).map(normalizeProduct).filter((item) => item.id)
      setProducts(nextProducts)
      await loadStocks(nextProducts)
    } catch (requestError) {
      setError(`Không tải được sản phẩm từ Product PU: ${requestError.message}`)
    } finally {
      setLoadingProducts(false)
    }
  }
  const loadCart = async () => {
    setLoadingCart(true)
    try {
      const payload = await cartService.getCart()
      const cartItems = getArrayPayload(payload)
      
      // Enrich cart items with product data
      const enrichedItems = cartItems.map((item, index) => {
        const productId = item.productId ?? item.id
        const product = products.find((p) => p.id === productId) || {}
        
        return normalizeCartItem({ ...item, product }, index)
      })
      
      setCartItems(enrichedItems)
    } catch (requestError) {
      setError(`Không tải được giỏ hàng từ Cart PU: ${requestError.message}`)
    } finally {
      setLoadingCart(false)
    }
  }

  useEffect(() => {
    // Initial API load for demo data from Processing Units.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts()
    loadCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = async (productId) => {
    setAddingProductId(productId)
    setError('')
    setMessage('')

    try {
      await cartService.addToCart(productId, 1)
      setMessage('Đã thêm sản phẩm vào giỏ hàng.')
      await loadCart()
    } catch (requestError) {
      setError(`Không thêm được sản phẩm vào giỏ: ${requestError.message}`)
    } finally {      setAddingProductId(null)
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    setError('')
    setMessage('')

    try {
      await orderService.checkout(cartItems, products)
      setMessage('Đặt hàng thành công. Giỏ hàng và tồn kho đã được cập nhật.')
      
      // Clear cart from localStorage after successful checkout
      localStorage.removeItem('flashsale_cart')
      
      await Promise.all([loadCart(), loadProducts()])
    } catch (requestError) {
      setError(`Đặt hàng thất bại từ Order PU: ${requestError.message}`)
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <main className="app-shell">
      <Header productCount={products.length} cartCount={cartItems.length} />

      {(message || error) && (
        <div className={`notice ${error ? 'notice-error' : 'notice-success'}`} role="status">
          {error || message}
        </div>
      )}

      <section className="demo-layout">
        <div className="products-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Product PU + Inventory PU</p>
              <h2>Danh sách sản phẩm</h2>
            </div>
            <button className="ghost-button" type="button" onClick={loadProducts}>
              Reload stock
            </button>
          </div>

          <ProductList
            products={products}
            stockById={stockById}
            loading={loadingProducts}
            addingProductId={addingProductId}
            onAddToCart={handleAddToCart}
          />
        </div>

        <Cart
          items={cartItems}
          total={cartTotal}
          loading={loadingCart}
          checkingOut={checkingOut}
          onCheckout={handleCheckout}
        />
      </section>
    </main>
  )
}

export default HomePage
