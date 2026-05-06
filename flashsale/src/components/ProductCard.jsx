function ProductCard({ product, stock, onAddToCart, isAdding }) {
  const isOutOfStock = Number(stock) <= 0

  return (
    <article className="product-card">
      <div className="sale-badge">Flash Sale</div>

      <div className="product-thumb" aria-hidden="true">
        {product.name?.slice(0, 2).toUpperCase() || 'FS'}
      </div>

      <div className="product-content">
        <h2>{product.name}</h2>
        <p className="product-id">Mã: {product.id}</p>

        <div className="product-meta">
          <div>
            <small>Giá</small>
            <strong>{product.formattedPrice}</strong>
          </div>
          <div>
            <small>Tồn kho</small>
            <strong className={isOutOfStock ? 'stock-empty' : 'stock-ready'}>
              {stock ?? 'Đang tải'}
            </strong>
          </div>
        </div>
      </div>

      <button
        className="primary-button"
        type="button"
        disabled={isAdding || isOutOfStock}
        onClick={() => onAddToCart(product.id)}
      >
        {isAdding ? 'Đang thêm...' : isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
      </button>
    </article>
  )
}

export default ProductCard
