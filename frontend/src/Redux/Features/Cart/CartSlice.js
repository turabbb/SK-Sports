import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    selectedItems: 0,
    totalPrice: 0,
    delivery: 0,
    grandTotal: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const isExist = state.items.find(item => item._id === action.payload._id);

            if (!isExist) {
                state.items.push({ ...action.payload, quantity: 1 });
            } else {
                isExist.quantity += 1;
            }

            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.delivery = setDelivery(state);
            state.grandTotal = setGrandTotal(state);
        },

        updateQuantity: (state, action) => {
            state.items = state.items.map(item => {
                if (item._id === action.payload._id) {
                    if (action.payload.type === 'increment') {
                        item.quantity += 1;
                    } else if (action.payload.type === 'decrement' && item.quantity > 1) {
                        item.quantity -= 1;
                    }
                }
                return item;
            });

            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.delivery = setDelivery(state);
            state.grandTotal = setGrandTotal(state);
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload._id);
            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.delivery = setDelivery(state);
            state.grandTotal = setGrandTotal(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.selectedItems = 0;
            state.totalPrice = 0;
            state.delivery = 0;
            state.grandTotal = 0;
        },
    },
});

// Utility functions
export const setSelectedItems = (state) =>
    state.items.reduce((total, item) => total + item.quantity, 0);

export const setTotalPrice = (state) =>
    state.items.reduce((total, item) => total + item.quantity * item.price, 0);

export const setDelivery = (state) => {
    const fixedDeliveryCharge = 300;
    return state.items.length > 0 ? fixedDeliveryCharge : 0;
};

export const setGrandTotal = (state) => state.totalPrice + state.delivery;

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
