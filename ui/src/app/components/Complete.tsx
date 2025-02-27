'use client';
import React from 'react';
import { RootState } from '../../lib/store';
import { useSelector } from 'react-redux';

export default function Complete() {
  const userDetails = useSelector((state: RootState) => state.detailsSelection);

  return (
    <React.Fragment>
      <div className="w-screen h-screen gap-4 flex flex-col justify-center items-center">
        <div className="text-xl font-semibold text-gray-900">CarePay</div>
        <div>Onboarding complete</div>
        {userDetails && (
          <div className="bg-green-200 w-full lg:w-1/2 lg:p-4 lg:rounded-lg">
            <b>{userDetails.name}</b> will receive a link on their Whatsapp{' '}
            <b>{userDetails.reference_contact}</b> to complete the registration
            process. They can complete the further process by using that link
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
