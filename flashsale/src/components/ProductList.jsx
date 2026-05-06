import ProductCard from './ProductCard'

function ProductList({ products, stockById, loading, addingProductId, onAddToCart }) {
  if (loading) {
    return <div className="panel-state">Đang tải danh sách sản phẩm...</div>
  }

  if (!products.length) {
    return <div className="panel-state">Chưa có sản phẩm từ Product PU.</div>
  }

  return (
    <section className="product-grid" aria-label="Danh sách sản phẩm">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          stock={stockById[product.id] ?? product.stock}
          isAdding={addingProductId === product.id}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  )
}

export default ProductList
