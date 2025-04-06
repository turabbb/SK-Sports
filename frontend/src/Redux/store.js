import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Features/Cart/CartSlice'
import auth from './Features/Auth/Auth'
import UserAuthReducer from './Features/Auth/AuthSlice'

export const store = configureStore({
  reducer: {
     cart: cartReducer,
     [auth.reducerPath]: auth.reducer,
     UserAuth: UserAuthReducer,
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(auth.middleware),
})