import { createApiClient } from '../api/axiosClient'
import { productService } from './productService'

const orderApi = createApiClient('')

const ORDERS_STORAGE_KEY = 'flashsale_orders'

// Helper to get orders from localStorage
const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY)
    return orders ? JSON.parse(orders) : []
  } catch {
    return []
  }
}

// Helper to save orders to localStorage
const saveOrderToStorage = (order) => {
  try {
    const orders = getOrdersFromStorage()
    orders.push(order)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    console.error('Failed to save order to localStorage')
  }
}

export const orderService = {
  async checkout(cartItems = [], products = []) {
    // Validate cart before checkout
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty. Cannot checkout.')
    }

    // Reduce stock for all items
    try {
      productService.reduceStockBatch(cartItems, products)
    } catch (error) {
      throw new Error(`Checkout failed: ${error.message}`)
    }

    // Create local order
    const order = {
      orderId: `ORD-${Date.now()}`,
      items: cartItems,
      timestamp: new Date().toISOString(),
      status: 'completed',
    }

    saveOrderToStorage(order)

    return {
      success: true,
      message: 'Checkout successful',
      orderId: order.orderId,
    }
  },
}
