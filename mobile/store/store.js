import { configureStore } from '@reduxjs/toolkit';
import auth from '../store/auth/slice';

const store = configureStore({
  reducer: {
    auth,
  },
});

export default store;
