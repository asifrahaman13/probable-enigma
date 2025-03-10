import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const pageSelectionSlice = createSlice({
  name: 'pageSelection',
  initialState: {
    pageSelected: 'OTP',
  },
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.pageSelected = action.payload;
    },
  },
});

export const { setPage } = pageSelectionSlice.actions;

export default pageSelectionSlice.reducer;
