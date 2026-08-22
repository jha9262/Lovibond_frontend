import React from "react";
import { Button } from "./ui";
import LoadingIcon from "./LoadingIcon";

const DisplayFolder = ({ setFolderName, onClose, folderData, loading, Err }) => {
  const handleSelectFolder = (name) => {
    setFolderName(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-industrial-900/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-industrial-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-industrial-100 px-6 py-4 border-b-2 border-industrial-200 flex justify-between items-center">
          <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">
            EXISTING FOLDERS
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-industrial-200 text-industrial-400 hover:text-industrial-900 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <LoadingIcon />
              <p className="text-[10px] font-bold text-industrial-400 uppercase tracking-widest">Loading folders...</p>
            </div>
          ) : Err ? (
            <div className="bg-red-50 border-2 border-red-100 rounded-xl p-8 text-center text-red-600">
              <p className="text-xs font-bold uppercase tracking-tight">FAILED TO LOAD FOLDERS</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {Object.values(folderData).map((folder, index) => (
                <div
                  key={index}
                  className="group p-4 bg-industrial-50 border-2 border-industrial-100 rounded-xl cursor-pointer hover:border-industrial-900 hover:bg-white transition-all"
                  onClick={() => handleSelectFolder(folder[0])}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-black text-industrial-900 uppercase tracking-tight">{folder[0]}</p>
                      <p className="text-[10px] font-bold text-industrial-400 uppercase tracking-widest">CREATED: {folder[3]}</p>
                    </div>
                    <div className="bg-industrial-200 group-hover:bg-industrial-900 group-hover:text-white px-2 py-1 rounded-md transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-tighter">DEVICES: {folder[5]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-industrial-50 border-t-2 border-industrial-100 flex justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
            label="CLOSE"
            className="px-6 py-2 bg-industrial-200 text-industrial-700 hover:bg-industrial-300 border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayFolder;
