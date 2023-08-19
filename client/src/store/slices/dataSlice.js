import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: "data",
    initialState: {
        loading: false,
        tokenSymbol: '',
        bonds: [],
        usdcBalance: 0,
        investors: []
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setTokenSymbol(state, action) {
            state.tokenSymbol = action.payload;
        },
        setBonds(state, action) {
            state.bonds = action.payload;
        },
        setUSDCBalance(state, action) {
            state.usdcBalance = action.payload;
        },
        setInvestors(state, action) {
            state.investors = action.payload;
        }
    }
});

export const {
    setLoading,
    setTokenSymbol,
    setBonds,
    setUSDCBalance,
    setInvestors
} = dataSlice.actions;
export const dataReducer = dataSlice.reducer;