/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import pageSelectionReducer from './features/pageSelection';
import detailsReducer from './features/detailsSelection';
import otpReducer from './features/otpSlection';

export default configureStore({
  reducer: {
    pageSelection: pageSelectionReducer,
    detailsSelection: detailsReducer,
    otpSelection: otpReducer,
  },
});

const rootReducer = combineReducers({
  pageSelection: pageSelectionReducer,
  detailsSelection: detailsReducer,
  otpSelection: otpReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
