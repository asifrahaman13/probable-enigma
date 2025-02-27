import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PersonalInfo = {
  date_of_birth: string;
  email_id: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile_number: string | null;
  name: string;
  pan: string;
  reference_contact: string;
};

const initialState: PersonalInfo = {
  date_of_birth: '',
  email_id: '',
  gender: 'Male',
  mobile_number: null,
  name: '',
  pan: '',
  reference_contact: '',
};

export const detailsSelectionSlice = createSlice({
  name: 'detailsSelection',
  initialState,
  reducers: {
    setDetails: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setDetails } = detailsSelectionSlice.actions;
export default detailsSelectionSlice.reducer;
