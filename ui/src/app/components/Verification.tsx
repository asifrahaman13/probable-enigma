import React from 'react';
import { useDispatch } from 'react-redux';

export default function Verification() {
  const dispath = useDispatch();

  async function Verify() {
    dispath({ type: 'pageSelection/setPage', payload: 'UPLOAD_KYC' });
  }

  return (
    <React.Fragment>
      <div className=" flex flex-col justify-center h-screen items-center">
        <div className="shadow-xl flex flex-col gap-4  w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>

          <div>
            <div className="text-gray-800 font-semibold text-lg">
              Patient onboarding
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="hs-lastname-contacts-1"
              className=" text-sm text-gray-800 "
            >
              A 4 digit OTP is sent to +91 8754332345
            </label>

            <input
              type="text"
              name="hs-lastname-contacts-1"
              id="hs-lastname-contacts-1"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 placeholder:text-center"
              placeholder="_"
            />
          </div>
          <div className="mt-6 grid">
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-900 text-white hover:bg-blue-900 focus:outline-none focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => Verify()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
