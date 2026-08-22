import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDevice, saveDevices } from '../features/devices/devicesSlice';
import { Button } from './ui';
import store from "../store";

const DeleteDeviceConfirmationModal = ({ isDeleteModalOpen, deviceName, setisDeleteModalOpen, deviceIndex }) => {
  const dispatch = useDispatch();

  if (!isDeleteModalOpen) {
    return null;
  }

  const handleDelete = () => {
    dispatch(deleteDevice(deviceIndex));
    const updatedDevices = store.getState().devices.devices;
    dispatch(saveDevices({ devices: updatedDevices, folderName: "DEFAULT_FOLDER" }));
    setisDeleteModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-900/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-industrial-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-red-50 px-6 py-4 border-b-2 border-red-100 flex justify-between items-center">
          <h2 className="text-sm font-black text-red-900 tracking-wider uppercase">
            CONFIRM DELETE
          </h2>
          <button
            onClick={() => setisDeleteModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 hover:text-red-900 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-industrial-500 uppercase tracking-widest">
              ARE YOU SURE YOU WANT TO DELETE?
            </p>
            <h3 className="text-2xl font-black text-industrial-900 tracking-tight break-words">
              {deviceName}
            </h3>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              label="CANCEL"
              onClick={() => setisDeleteModalOpen(false)}
              className="flex-1 py-3 bg-industrial-100 text-industrial-700 hover:bg-industrial-200 border-none"
            />
            <Button
              variant="primary"
              label="DELETE DEVICE"
              onClick={handleDelete}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 border-red-700 shadow-[0_4px_0_0_rgba(153,27,27,1)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeviceConfirmationModal;
