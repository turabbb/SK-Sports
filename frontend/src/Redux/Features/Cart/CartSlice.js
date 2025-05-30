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
            // Check for existing item considering both ID and size
            const isExist = state.items.find(item => 
                item._id === action.payload._id && 
                item.selectedSize === action.payload.selectedSize
            );

            if (!isExist) {
                // Add new item with the quantity from payload
                state.items.push({ 
                    ...action.payload, 
                    quantity: action.payload.quantity || 1 // Use payload quantity or default to 1
                });
            } else {
                // Add the payload quantity to existing item
                isExist.quantity += (action.payload.quantity || 1);
            }

            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.delivery = setDelivery(state);
            state.grandTotal = setGrandTotal(state);
        },

        updateQuantity: (state, action) => {
            state.items = state.items.map(item => {
                // Update quantity considering both ID and size
                if (item._id === action.payload._id && 
                    item.selectedSize === action.payload.selectedSize) {
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
            // Remove item considering both ID and size
            state.items = state.items.filter(item => 
                !(item._id === action.payload._id && 
                  item.selectedSize === action.payload.selectedSize)
            );
            
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

        // New reducer to set exact quantity (useful for cart page)
        setQuantity: (state, action) => {
            state.items = state.items.map(item => {
                if (item._id === action.payload._id && 
                    item.selectedSize === action.payload.selectedSize) {
                    item.quantity = Math.max(1, action.payload.quantity); // Ensure minimum 1
                }
                return item;
            });

            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.delivery = setDelivery(state);
            state.grandTotal = setGrandTotal(state);
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
    clearCart,
    setQuantity
} = cartSlice.actions;

export default cartSlice.reducer;