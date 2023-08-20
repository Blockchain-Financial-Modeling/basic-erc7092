import { configureStore } from '@reduxjs/toolkit';
import {
    dataReducer,
    setLoading,
    setTokenSymbol,
    setBondsSymbol,
    setBonds,
    setUSDCBalance,
    setInvestors,
    setInvestorsBalances
} from './slices/dataSlice';

const store = configureStore({
    reducer: {
        data: dataReducer
    }
});

export {
    store,
    setLoading,
    setTokenSymbol,
    setBondsSymbol,
    setBonds,
    setUSDCBalance,
    setInvestors,
    setInvestorsBalances
};