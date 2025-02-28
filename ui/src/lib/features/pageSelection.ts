import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const pageSelectionSlice = createSlice({
  name: 'pageSelection',
  initialState: {
    pageSelected: 'FORM_MODE',
  },
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.pageSelected = action.payload;
    },
  },
});

export const { setPage } = pageSelectionSlice.actions;

export default pageSelectionSlice.reducer;
