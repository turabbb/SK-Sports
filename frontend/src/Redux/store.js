import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Features/Cart/CartSlice'
import auth from './Features/Auth/Auth'
import UserAuthReducer from './Features/Auth/AuthSlice'
import products from './Features/Products/products'
import orders from './Features/Checkout/Order'

export const store = configureStore({
  reducer: {
     cart: cartReducer,
     [auth.reducerPath]: auth.reducer,
     UserAuth: UserAuthReducer,
     [products.reducerPath]: products.reducer,
     [orders.reducerPath]: orders.reducer,
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(auth.middleware, products.middleware, orders.middleware),
})