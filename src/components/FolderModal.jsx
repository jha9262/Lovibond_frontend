import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../config/index.js";
import { Button } from "./ui";
import DisplayFolder from "./DisplayFolder";

const FolderModal = ({ isOpen, onClose, onSubmit, folderName, setFolderName, newFolder }) => {
  const [error, setError] = useState("");
  const [showExistingFolders, setShowExistingFolders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [folderData, setFolderData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchFolderName();
    }
  }, [isOpen]);

  const fetchFolderName = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/REPORT_FILE_NAME_GET?REFRESH=TRUE&PATH=DCN_FOLDER&PATH_TYPE=DCN_FOLDER`);
      setFolderData(res?.data?.SD_CARD_FOLDER_RECORD || []);
    } catch (error) {
      console.error("Error fetching folder names", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const invalidChars = /[\/:?\"<>|,{}!#@$%^&*()=`+-;]/;

    if (invalidChars.test(value)) {
      setError("INVALID CHARACTERS NOT ALLOWED");
      return;
    } else if (value.length > 15) {
      setError("MAX 15 CHARACTERS ALLOWED");
      return;
    } else {
      setError("");
      setFolderName(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-900/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-industrial-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-industrial-100 px-6 py-4 border-b-2 border-industrial-200 flex justify-between items-center">
          <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">
            RECORD FOLDER NAME
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

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight text-center">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              FOLDER NAME
            </label>
            <input
              type="text"
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-3 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all placeholder:text-industrial-300"
              placeholder="ENTER FOLDER NAME"
              value={folderName}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              variant="secondary"
              label="SELECT EXISTING"
              onClick={() => setShowExistingFolders(true)}
              className="flex-1 py-2.5 bg-industrial-100 text-industrial-700 hover:bg-industrial-200 border-none"
            />
            <Button
              variant="primary"
              label="SUBMIT"
              onClick={onSubmit}
              disabled={!folderName || !!error}
              className="flex-1 py-2.5"
            />
          </div>
        </div>
      </div>

      {showExistingFolders && (
        <DisplayFolder
          Err={error}
          loading={loading}
          folderData={folderData}
          setFolderName={setFolderName}
          onClose={() => setShowExistingFolders(false)}
          setFolderData={setFolderData}
        />
      )}
    </div>
  );
};

export default FolderModal;
