import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Features/Cart/CartSlice'

export const store = configureStore({
  reducer: {
     cart: cartReducer,
  },
})