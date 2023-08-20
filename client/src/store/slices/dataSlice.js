import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: "data",
    initialState: {
        loading: false,
        tokenSymbol: '',
        bondsSymbol: '',
        bonds: [],
        usdcBalance: 0,
        investors: [],
        investorsBalances: []
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setTokenSymbol(state, action) {
            state.tokenSymbol = action.payload;
        },
        setBondsSymbol(state, action) {
            state.bondsSymbol = action.payload;
        },
        setBonds(state, action) {
            state.bonds = action.payload;
        },
        setUSDCBalance(state, action) {
            state.usdcBalance = action.payload;
        },
        setInvestors(state, action) {
            state.investors = action.payload;
        },
        setInvestorsBalances(state, action) {
            state.investorsBalances = action.payload;
        }
    }
});

export const {
    setLoading,
    setTokenSymbol,
    setBondsSymbol,
    setBonds,
    setUSDCBalance,
    setInvestors,
    setInvestorsBalances
} = dataSlice.actions;
export const dataReducer = dataSlice.reducer;