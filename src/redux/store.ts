import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import accountReducer from './slices/accountSlide';
import roleReducer from './slices/roleSlide'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        account: accountReducer,
        role: roleReducer,
    },
});

// Export types để sử dụng với TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;