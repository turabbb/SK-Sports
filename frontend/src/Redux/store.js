import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Features/Cart/CartSlice'
import auth from './Features/Auth/Auth'
import authReducer from './Features/Auth/AuthSlice'

export const store = configureStore({
  reducer: {
     cart: cartReducer,
     [auth.reducerPath]: auth.reducer,
     auth: authReducer
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(auth.middleware),
})