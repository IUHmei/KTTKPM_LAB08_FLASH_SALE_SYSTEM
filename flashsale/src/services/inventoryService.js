// Inventory service is not available in development
// The HomePage component already has fallback logic to use product.stock
export const inventoryService = {
  async getStock(productId) {
    // Reject to trigger fallback to product.stock in HomePage
    return Promise.reject(new Error('Inventory service not available'))
  },
}
