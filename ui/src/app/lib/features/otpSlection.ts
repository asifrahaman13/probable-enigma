import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OTP = {
  phone_number: string;
  otp: string;
};

const initialState: OTP = {
  phone_number: '',
  otp: '',
};

export const otpSelectionSlice = createSlice({
  name: 'otpSelection',
  initialState,
  reducers: {
    setOTP: (state, action: PayloadAction<Partial<OTP>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setOTP } = otpSelectionSlice.actions;
export default otpSelectionSlice.reducer;
