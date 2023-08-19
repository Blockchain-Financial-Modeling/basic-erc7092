import { configureStore } from '@reduxjs/toolkit';
import {
    dataReducer,
    setLoading,
    setTokenSymbol,
    setBonds,
    setUSDCBalance,
    setInvestors
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
    setBonds,
    setUSDCBalance,
    setInvestors
};