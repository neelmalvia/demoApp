
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recordingSlice } from './recordingSlice'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  [recordingSlice.name]: recordingSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store)

