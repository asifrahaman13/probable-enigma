import React from "react";

export default function ChatMode() {
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center h-screen items-center">
        <div className="shadow-xl flex flex-col gap-4 w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>

          <div>
            <div className="text-gray-800 font-semibold text-lg">
              Care AI chat
            </div>
            <div>
                
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}