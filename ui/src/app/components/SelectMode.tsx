import React from 'react';
import { useDispatch } from 'react-redux';

export default function SelectMode() {
  const dispath = useDispatch();

  async function selectMode(mode: string) {
    dispath({ type: 'pageSelection/setPage', payload: mode });
  }

  return (
    <React.Fragment>
      <div className="flex flex-col justify-center h-screen items-center">
        <div className="shadow-xl flex flex-col gap-4 w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>

          <div>
            <div className="text-gray-800 font-semibold text-lg">
              Choose your next interface
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="bg-gray-200  text-black font-bold py-2 px-4 rounded"
              onClick={() => {
                selectMode('CHAT_MODE');
              }}
            >
              Chat mode
            </button>
            <button
              className="bg-gray-200 text-black font-bold py-2 px-4 rounded"
              onClick={() => {
                selectMode('FORM_MODE');
              }}
            >
              Form mode
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
