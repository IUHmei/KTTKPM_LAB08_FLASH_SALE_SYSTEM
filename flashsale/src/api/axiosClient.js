import axios from 'axios'

const DEFAULT_TIMEOUT = 100;

export const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Không thể kết nối Processing Unit.'

      return Promise.reject(new Error(message))
    },
  )

  return client
}

export default createApiClient
