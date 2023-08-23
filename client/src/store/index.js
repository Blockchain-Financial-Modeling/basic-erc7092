import { configureStore } from '@reduxjs/toolkit';
import {
    dataReducer,
    setLoading,
    setTokenSymbol,
    setBondsSymbol,
    setBonds,
    setUSDCBalance,
    setPaymentBalance,
    setInvestors,
    setInvestorsBalances,
    setInterests,
    setCoupons
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
    setPaymentBalance,
    setInvestors,
    setInvestorsBalances,
    setInterests,
    setCoupons
};