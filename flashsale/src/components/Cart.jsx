function Cart({ items, total, loading, checkingOut, onCheckout }) {
  return (
    <aside className="cart-panel" aria-label="Giỏ hàng">
      <div className="cart-header">
        <div>
          <p className="eyebrow">Cart PU</p>
          <h2>Giỏ hàng</h2>
        </div>
        <span className="cart-count">{items.length}</span>
      </div>

      {loading ? (
        <div className="panel-state">Đang tải giỏ hàng...</div>
      ) : items.length ? (
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.key}>
              <div>
                <strong>{item.name}</strong>
                <small>SL: {item.quantity}</small>
              </div>
              <span>{item.formattedLineTotal}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel-state">Giỏ hàng đang trống.</div>
      )}

      <div className="cart-total">
        <span>Tổng tiền</span>
        <strong>{total}</strong>
      </div>

      <button
        className="checkout-button"
        type="button"
        disabled={!items.length || checkingOut}
        onClick={onCheckout}
      >
        {checkingOut ? 'Đang đặt hàng...' : 'Đặt hàng'}
      </button>
    </aside>
  )
}

export default Cart
