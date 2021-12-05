import React from "react";
import Webcam from "react-webcam";

interface WebcamModalProps {
  setHandleCloseModal: Function;
  setvalidatePicture: Function;
  title?: string;
};

const WebcamModal = ({ setHandleCloseModal, setvalidatePicture, title }: WebcamModalProps) => {
  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current!.getScreenshot({ width: 384, height: 384 });
      setvalidatePicture(imageSrc);
    },
    [webcamRef, setvalidatePicture]
  );

  return (
    <div id="bio-modal" className="absolute z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        {/*This element is to trick the browser into centering the modal contents.*/}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-xl text-center leading-6 font-medium text-gray-900" id="modal-title">
                  {title || "Face Authentication"}
                </h3>
                <div className="pt-8 pb-2">
                  <p>
                    Please make sure that:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>There is enough lighting in the room.</li>
                    <li>Your face is clearly visible.</li>
                    <li>You don't have any temporary accessories on your face.</li>
                    <li>Your face is close enough to the camera.</li>
                  </ul>
                </div>
                <div className="m-8 border-green-600 border-8 rounded-lg">
                  <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    audio={false}
                    screenshotQuality={0.92}
                    width={1280}
                    height={720}
                    screenshotFormat="image/jpeg" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => capture()}
              type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
              Validate Picture
            </button>
            <button type="button"
              onClick={() => setHandleCloseModal()}
              className=" mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamModal;