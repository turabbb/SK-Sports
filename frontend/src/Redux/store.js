import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Features/Cart/CartSlice'
import auth from './Features/Auth/Auth'

export const store = configureStore({
  reducer: {
     cart: cartReducer,
     [auth.reducerPath]: auth.reducer,
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(auth.middleware),
})