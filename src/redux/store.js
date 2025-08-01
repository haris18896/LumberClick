import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ** Reducers
import AuthSlice from './Auth';
import JobsSlice from './Jobs';
import SettingsSlice from './settings';
import DashboardSlice from './dashboard';
import jobDetailsSlice from './Jobs/JobDetailsSlice';

// Note: JobsSlice is already a combined reducer with main and details

const rootReducer = combineReducers({
  auth: AuthSlice,
  settings: SettingsSlice,
  jobs: JobsSlice,
  dashboard: DashboardSlice,
  jobDetails: jobDetailsSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === 'development',

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
