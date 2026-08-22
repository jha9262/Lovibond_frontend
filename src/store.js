import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from "./features/devices/devicesSlice";

const store = configureStore({
  reducer: {
    devices: devicesReducer,
  },
});

export default store;
