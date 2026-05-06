import { createApiClient } from '../api/axiosClient'

const productApi = createApiClient('')

const STOCK_STORAGE_KEY = 'flashsale_stock'

// Helper to get stock overrides from localStorage
const getStockOverrides = () => {
  try {
    const stock = localStorage.getItem(STOCK_STORAGE_KEY)
    return stock ? JSON.parse(stock) : {}
  } catch {
    return {}
  }
}

const saveStockOverrides = (stockMap) => {
  try {
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stockMap))
  } catch {
    console.error('Failed to save stock to localStorage')
  }
}

export const productService = {
  async getProducts() {
    const response = await productApi.get('/products')
    const products = response.data
    
    // Apply stock overrides from localStorage
    const stockOverrides = getStockOverrides()
    return products.map((product) => ({
      ...product,
      stock: stockOverrides[product.id] ?? product.stock,
    }))
  },

  async getProductById(productId) {
    const response = await productApi.get(`/products/${productId}`)
    const product = response.data
    
    // Apply stock override from localStorage
    const stockOverrides = getStockOverrides()
    return {
      ...product,
      stock: stockOverrides[product.id] ?? product.stock,
    }
  },

  // Reduce stock for a product (used during checkout)
  reduceStock(productId, quantity) {
    const stockOverrides = getStockOverrides()
    const currentStock = stockOverrides[productId] ?? 0
    
    if (currentStock < quantity) {
      throw new Error(`Insufficient stock for product ${productId}`)
    }
    
    stockOverrides[productId] = currentStock - quantity
    saveStockOverrides(stockOverrides)
  },
  // Reduce stock for multiple products
  reduceStockBatch(cartItems, products = []) {
    const stockOverrides = getStockOverrides()
    
    // Create a map of original products for reference
    const productMap = {}
    products.forEach((p) => {
      productMap[p.id] = p
    })
    
    // Validate all items have enough stock first
    cartItems.forEach((item) => {
      // Get current stock: either override or original product stock or from cart item
      let currentStock = stockOverrides[item.productId]
      if (currentStock === undefined) {
        // Try to get from original product data
        currentStock = productMap[item.productId]?.stock ?? item.stock ?? 0
      }
      
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}. Available: ${currentStock}, Requested: ${item.quantity}`)
      }
    })
    
    // Reduce stock for all items
    cartItems.forEach((item) => {
      let currentStock = stockOverrides[item.productId]
      if (currentStock === undefined) {
        // Initialize with original product stock
        currentStock = productMap[item.productId]?.stock ?? item.stock ?? 0
      }
      stockOverrides[item.productId] = currentStock - item.quantity
    })
    
    saveStockOverrides(stockOverrides)
  },
}
