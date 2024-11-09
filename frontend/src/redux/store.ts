// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userSlice from "../features/user/userSlice";
import vendorSlice from "../features/vendor/vendorSlice";
import adminSlice from "../features/admin/adminSlice";

// Define persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth', 'vendor', 'admin'], // Only these reducers will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
  auth: userSlice,
  vendor: vendorSlice,
  admin: adminSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export store
export default store;

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;