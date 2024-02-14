import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice';
import boardSlice from '../features/boardSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  login: authSlice,
  board: boardSlice,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { persistor };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
