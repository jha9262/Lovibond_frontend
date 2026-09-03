import { useState } from 'react';
import { API_BASE_URL as BASE_URL } from '../../../config/index.js';
import toast from 'react-hot-toast';
import { X, Loader2, Pencil } from 'lucide-react';
import Button from '../../ui/Button';

const DownloadModal = ({
  isOpen,
  onClose,
  filePath,
  fileName,
  fileDate
}) => {
  const [editableFileName, setEditableFileName] = useState(
    fileName ? fileName.replace(/\.[^/.]+$/, "") : ""
  );
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  if (!isOpen) return null;

  const handleFileNameEdit = () => {
    setIsEditingFileName(true);
  };

  const handleFileNameSave = () => {
    if (editableFileName.trim()) {
      setIsEditingFileName(false);
    }
  };

  const handleFileNameCancel = () => {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    setEditableFileName(nameWithoutExtension);
    setIsEditingFileName(false);
  };

  const getFileFormat = () => {
    if (selectedFormat === "PDF") return "pdf";
    if (selectedFormat === "CSV") return "csv";
    if (selectedFormat === "XLS") return "xls";
    if (selectedFormat === "AUDIO(WAV)") return "audio(wav)";
    if (selectedFormat === "AUDIO(MP3)") return "audio(mp3)";
    return "pdf";
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const baseFileName = editableFileName.trim() ||
        fileName.replace(/\.[^/.]+$/, "") ||
        `batch_${new Date().toISOString().slice(0, 10).replace(/-/g, '_')}_${Date.now()}`;

      const finalFileName = `${baseFileName}_${fileDate}`;
      const fileFormat = getFileFormat();
      const fileType = "download";
      
      const downloadUrl = `${BASE_URL}/REPORT_LOG_DOWNLOAD?FILE_PATH=${encodeURIComponent(filePath)}&FILE_FORMAT=${fileFormat}&FILE_NAME=${encodeURIComponent(finalFileName)}&FILE_TYPE=${fileType}`;

      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`${selectedFormat} download started successfully!`);
      } catch (fetchError) {
        console.warn("Fetch method failed, trying direct link method:", fetchError);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${finalFileName}.${fileFormat}`;
        toast.success(`${selectedFormat} download initiated!`);
      }
    } catch (error) {
      toast.error("Failed to download file. Please check your connection.");
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  const handleView = async () => {
    try {
      setIsViewing(true);
      const baseFileName = editableFileName.trim() ||
        fileName.replace(/\.[^/.]+$/, "") ||
        `batch_${new Date().toISOString().slice(0, 10).replace(/-/g, '_')}_${Date.now()}`;

      const finalFileName = `${baseFileName}_${fileDate}`;
      const fileFormat = getFileFormat();
      const fileType = "view";
      
      const viewUrl = `${BASE_URL}/REPORT_LOG_DOWNLOAD?FILE_PATH=${encodeURIComponent(filePath)}&FILE_FORMAT=${fileFormat}&FILE_NAME=${encodeURIComponent(finalFileName)}&FILE_TYPE=${fileType}`;
      const newWindow = window.open(viewUrl, '_blank', 'noopener,noreferrer');

      if (newWindow) {
        toast.success(`${selectedFormat} opened for viewing!`);
      }
    } catch (error) {
      toast.error("Failed to view file. Please check your connection.");
    } finally {
      setIsViewing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-industrial-900/40 backdrop-blur-sm p-4 z-50 w-full animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-industrial-200 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-industrial-100 bg-industrial-50/50">
          <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">DOWNLOAD LOG</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-industrial-200 text-industrial-400 hover:text-industrial-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-industrial-400 mb-2">FILE NAME</h3>
            
            {isEditingFileName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editableFileName}
                  onChange={(e) => setEditableFileName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-industrial-50 border border-industrial-200 rounded-lg text-sm font-medium text-industrial-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  placeholder="Enter file name"
                  autoFocus
                />
                <Button label="SAVE" variant="primary" onClick={handleFileNameSave} className="!px-4 !py-2" />
                <Button label="CANCEL" variant="secondary" onClick={handleFileNameCancel} className="!px-4 !py-2" />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-industrial-50 rounded-lg border border-industrial-100">
                <span className="text-sm font-bold text-industrial-800">{editableFileName}</span>
                <button
                  onClick={handleFileNameEdit}
                  className="p-1.5 text-industrial-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                  title="Edit filename"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mt-3 text-[11px] text-industrial-500 font-medium">
              <span className="uppercase tracking-widest font-bold">Created:</span>
              <span>{fileDate}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-industrial-400 mb-2">CHOOSE FORMAT</h3>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-industrial-200 rounded-lg text-sm font-bold text-industrial-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all appearance-none cursor-pointer"
            >
              <option value="PDF">PDF Document (.pdf)</option>
              <option value="CSV">Excel Spreadsheet (.csv)</option>
              <option value="XLS">Excel Workbook (.xls)</option>
              <option value="AUDIO(WAV)">Audio File (.wav)</option>
              <option value="AUDIO(MP3)">Audio File (.mp3)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row justify-end p-5 gap-3 border-t border-industrial-100 bg-industrial-50/50">
          <Button
            label="VIEW FILE"
            variant="secondary"
            onClick={handleView}
            disabled={isViewing || isDownloading}
          />
          <Button
            label={isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
            variant="primary"
            onClick={handleDownload}
            disabled={isDownloading || isViewing}
            icon={isDownloading ? Loader2 : null}
            className={isDownloading ? "animate-pulse" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;