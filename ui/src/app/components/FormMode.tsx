'use client';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backendUrl } from '../../constants/creds';
import { UserDocument } from '../../types/documents';
import { RootState } from '@/lib/store';

export default function FormMode() {
  const dispath = useDispatch();
  const [userDetails, setUserDetails] = React.useState<UserDocument | null>(
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (userDetails) {
      setUserDetails({
        ...userDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  async function confirm() {
    try {
      const response = await axios.post(
        `${backendUrl}/api/confirm-details`,
        userDetails
      );
      if (response.status === 200) {
        dispath({ type: 'pageSelection/setPage', payload: 'COMPLETE' });
      }
    } catch {
      console.log('something wrong');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">PAN:</label>
          <input
            type="text"
            name="pan"
            value={userDetails?.pan}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={userDetails?.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userDetails?.gender === 'male'}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userDetails?.gender === 'female'}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={userDetails?.gender === 'other'}
                onChange={handleChange}
                className="mr-2"
              />
              Other
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email ID:</label>
          <input
            type="email"
            name="email_id"
            value={userDetails?.email_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Education:</label>
          <select
            name="education"
            value={userDetails?.education}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="highschool">High School</option>
            <option value="bachelor">Bachelor&apos;s</option>
            <option value="master">Master&apos;s</option>
            <option value="phd">PhD</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Married:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="married"
                value="yes"
                checked={userDetails?.married === 'yes'}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="married"
                value="no"
                checked={userDetails?.married === 'no'}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact:</label>
          <input
            type="text"
            name="mobile_number"
            value={userDetails?.mobile_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Reference Contact:</label>
          <input
            type="text"
            name="reference_contact"
            value={userDetails?.reference_contact}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <button
            onClick={confirm}
            className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
