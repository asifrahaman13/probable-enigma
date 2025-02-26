import React from 'react';
import { useDispatch } from 'react-redux';

export default function Otp() {
  const dispath = useDispatch();

  async function SendOtp() {
    dispath({ type: 'pageSelection/setPage', payload: 'VERIFICATION' });
  }
  return (
    <React.Fragment>
      <div className=" flex flex-col justify-center h-screen items-center">
        <div className="shadow-xl flex flex-col gap-4  w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>
          <div>
            <a
              className="group flex flex-col justify-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-xl p-4 md:p"
              href="#"
            >
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                <svg
                  className="shrink-0 size-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 7h-9" />
                  <path d="M14 17H5" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="7" cy="7" r="3" />
                </svg>
              </div>
              <div className="mt-5">
                <h3 className="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-400">
                  Welcome to
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Components are easily customized and extendable
                </p>
                <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium">
                  Learn more
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </a>
          </div>
          <div>
            <div className="text-gray-800 font-semibold text-lg">
              Patient onboarding
            </div>
          </div>
          <div>
            <label
              htmlFor="hs-lastname-contacts-1"
              className=" text-sm text-gray-800 "
            >
              Enter the patient&apos;s mobile number linked to PAN.
            </label>

            <input
              type="text"
              name="hs-lastname-contacts-1"
              id="hs-lastname-contacts-1"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Enter your mobile number"
            />
          </div>
          <div className="mt-6 grid">
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-900 text-white hover:bg-blue-900 focus:outline-none focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => SendOtp()}
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
