'use client';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backendUrl } from '../../constants/creds';
import { UserDocument } from '../../types/documents';
import { RootState } from '@/lib/store';
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

export default function FormMode() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();
  const [userDetails, setUserDetails] = React.useState<UserDocument | null>(
    null
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

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
        showToast('Error fetching details', 'error');
      }
    }

    fetchPresentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.phone_number]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (userDetails) {
      const { name, value } = e.target;
      setUserDetails({
        ...userDetails,
        [name]: value,
      });

      let error = '';
      if (
        (name === 'mobile_number' || name === 'reference_contact') &&
        !/^\+91 \d{10}$/.test(value)
      ) {
        error = 'Contact should be of the format: +yy xxxxxxxxxx';
      } else if (
        name === 'email_id' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        error = 'Invalid email format';
      } else if (name === 'pan' && value.length !== 10) {
        error = 'PAN should be 10 characters long';
      } else if (
        name === 'date_of_birth' &&
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
      ) {
        error = 'Invalid date format';
      }

      setErrors({
        ...errors,
        [name]: error,
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
        dispatch({ type: 'pageSelection/setPage', payload: 'COMPLETE' });
      }
    } catch {
      showToast('Error confirming details', 'error');
    }
  }

  return (
    <React.Fragment>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="flex items-center justify-center min-h-screen h-screen bg-gray-100">
        <div className="bg-white lg:p-6 p-4 rounded-lg shadow-lg overflow-y-scroll no-scrollbar w-full h-full lg:h-3/4 max-w-md">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">PAN:</label>
            <input
              type="text"
              name="pan"
              value={userDetails?.pan}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.pan && <p className="text-red-500 text-sm">{errors.pan}</p>}
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
            {errors.date_of_birth && (
              <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
            )}
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
            {errors.email_id && (
              <p className="text-red-500 text-sm">{errors.email_id}</p>
            )}
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
            {errors.mobile_number && (
              <p className="text-red-500 text-sm">{errors.mobile_number}</p>
            )}
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
            {errors.reference_contact && (
              <p className="text-red-500 text-sm">{errors.reference_contact}</p>
            )}
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
    </React.Fragment>
  );
}
