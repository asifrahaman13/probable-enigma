'use client';
import React from 'react';
import { RootState } from '../../lib/store';
import { useSelector } from 'react-redux';
import { backendUrl } from '@/constants/creds';
import axios from 'axios';

type UserDetails = {
  name: string;
};

export default function Complete() {
  const [userDetails, setUserDetails] = React.useState<UserDetails | null>(
    null
  );

  const otp = useSelector((state: RootState) => state.otpSelection);

  React.useEffect(() => {
    async function fetchPresentDetails() {
      try {
        const response = await axios.get(
          `${backendUrl}/api/get-details/${otp.phone_number}`
        );
        if (response.status === 200) {
          setUserDetails(response.data);
        }
      } catch {
        console.log("Couldn't fetch details");
      }
    }
    fetchPresentDetails();
  }, [otp.phone_number]);

  return (
    <React.Fragment>
      <div className="w-screen h-screen gap-4 flex flex-col justify-center items-center">
        <div className="text-xl font-semibold text-gray-900">CarePay</div>
        <div>Onboarding complete</div>
        {userDetails && (
          <div className="bg-green-200 w-full lg:w-1/2 lg:p-4 lg:rounded-lg">
            <b>{userDetails.name}</b> will receive a link on their Whatsapp{' '}
            <b>{otp.phone_number}</b> to complete the registration process. They
            can complete the further process by using that link
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
