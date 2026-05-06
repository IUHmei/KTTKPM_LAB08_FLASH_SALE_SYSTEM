function Header({ productCount, cartCount }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Space-Based Architecture Demo</p>
        <h1>Flash Sale System</h1>
      </div>

      <div className="header-stats" aria-label="Thống kê hệ thống">
        <div>
          <span>{productCount}</span>
          <small>Sản phẩm</small>
        </div>
        <div>
          <span>{cartCount}</span>
          <small>Trong giỏ</small>
        </div>
      </div>
    </header>
  )
}

export default Header
