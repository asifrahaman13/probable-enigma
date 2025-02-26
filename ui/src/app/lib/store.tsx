/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pageSelectionReducer from "./features/pageSelection";
import detailsReducer from "./features/detailsSelection";

export default configureStore({
  reducer: {
    pageSelection: pageSelectionReducer,
    detailsSelection: detailsReducer
  },
});

const rootReducer = combineReducers({
  pageSelection: pageSelectionReducer,
  detailsSelection: detailsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
