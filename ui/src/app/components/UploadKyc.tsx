import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { backendUrl } from '../../constants/creds';

export default function UploadKyc() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>('');

  async function FetchDetails() {
    if (!selectedFile || !documentName) {
      alert('Please select a document name and file.');
      return;
    }

    const formData = new FormData();
    formData.append('documentName', documentName);
    formData.append('file', selectedFile);

    dispatch({ type: 'pageSelection/setPage', payload: 'FETCHING' });

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        dispatch({ type: 'pageSelection/setPage', payload: 'SELECT_MODE' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentName(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col justify-center h-screen items-center">
        <div className="shadow-xl flex flex-col gap-4 w-full lg:w-1/4 h-full lg:h-3/4 max-h-1/2 p-4 rounded-lg">
          <div className="w-full flex justify-center">
            <div className="text-xl font-semibold text-gray-900">CarePay</div>
          </div>

          <div>
            <div className="text-gray-800 font-semibold text-lg">
              Upload KYC document
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="hs-lastname-contacts-1"
              className="text-sm text-gray-800"
            >
              Submit any of the following document to verify the identity of the
              borrower/patient.
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-sm">Select name of the document</div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-y-3">
                <div className="flex">
                  <input
                    type="radio"
                    name="documentName"
                    value="Aadhaar"
                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-vertical-group-1"
                    onChange={handleDocumentNameChange}
                  />
                  <label
                    htmlFor="hs-radio-vertical-group-1"
                    className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
                  >
                    Aadhaar
                  </label>
                </div>

                <div className="flex">
                  <input
                    type="radio"
                    name="documentName"
                    value="PAN"
                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-vertical-group-2"
                    onChange={handleDocumentNameChange}
                  />
                  <label
                    htmlFor="hs-radio-vertical-group-2"
                    className="text-sm text-gray-500 ms-2 dark:text-neutral-400"
                  >
                    PAN
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-sm">Tap below to upload your file</div>
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-600">
                Supported file - PDF, JPG, JPEG, PNG
              </div>
              <div>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  className="text-sm text-gray-500"
                />
                {selectedFile && (
                  <div className="text-sm text-gray-600 mt-2">
                    Selected file: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 grid">
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-900 text-white hover:bg-blue-900 focus:outline-none focus:bg-blue-900 disabled:opacity-50 disabled:pointer-events-none"
              onClick={FetchDetails}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
