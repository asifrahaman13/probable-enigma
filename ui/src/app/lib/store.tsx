/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pageSelectionReducer from "./features/pageSelection";

export default configureStore({
  reducer: {
    pageSelection: pageSelectionReducer,
  },
});

const rootReducer = combineReducers({
  pageSelection: pageSelectionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
