import { createSlice } from "@reduxjs/toolkit";

const LoadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState == null) return { user: null };
        return { user: JSON.parse(serializedState) };
    } catch (error) {
        return { user: null };
    }
}

const initialState = LoadUserFromLocalStorage();

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        setUser : (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user',JSON.stringify(state.user));
        },

        logout : (state) => {
            state.user = null;
            localStorage.removeItem('user');    
        }
    } 
})

export const {setUser , logout}  = AuthSlice.actions;
export default AuthSlice.reducer;