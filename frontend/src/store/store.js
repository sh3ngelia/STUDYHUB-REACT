import { configureStore } from '@reduxjs/toolkit';
import subjectsReducer from './subjectsSlice';

export const store = configureStore({
  reducer: { subjects: subjectsReducer },
});
