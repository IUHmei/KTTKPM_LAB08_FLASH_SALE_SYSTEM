import { createApiClient } from '../api/axiosClient'

const cartApi = createApiClient('')

const CART_STORAGE_KEY = 'flashsale_cart'

// Helper to get cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

// Helper to save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    console.error('Failed to save cart to localStorage')
  }
}

export const cartService = {
  async addToCart(productId, quantity = 1) {
    try {
      // Try calling the backend
      const response = await cartApi.post('/cart/add', {
        productId,
        quantity,
      })
      return response.data
    } catch {
      // Fallback to localStorage if backend is unavailable
      const cart = getCartFromStorage()
      const existingItem = cart.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({ productId, quantity })
      }

      saveCartToStorage(cart)
      return { success: true, message: 'Product added to cart (local)' }
    }
  },

  async getCart() {
    try {
      // Try calling the backend
      const response = await cartApi.get('/cart')
      return response.data
    } catch {
      // Fallback to localStorage if backend is unavailable
      return getCartFromStorage()
    }
  },
}
