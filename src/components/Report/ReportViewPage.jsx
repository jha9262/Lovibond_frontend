import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getReportLogs } from "../../services/deviceService";
import ReportHeader from "./components/ReportHeader";
import ReportTable from "./components/ReportTable";
import { Loader2 } from "lucide-react";

const ReportViewPage = () => {
  const location = useLocation();
  const { path, total_Logs } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    if (path) {
      fetchReportData(path, page, rowsPerPage);
    }
  }, [path, page, rowsPerPage]);

  const fetchReportData = async (path, page, rowsPerPage) => {
    setLoading(true);
    setError("");
    const LOG_START = (page - 1) * rowsPerPage + 1;
    const LOG_END = LOG_START + rowsPerPage - 1;

    try {
      const data = await getReportLogs({ 
        FILE_PATH: path, 
        LOG_START, 
        LOG_END, 
        PAGE_NO: page, 
        MAX_LOG_COUNT: total_Logs 
      });
      setReportData(data);
    } catch (error) {
      setError(error || "FAILED TO LOAD REPORT. TRY AGAIN...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-industrial-500">Home / Reports / Viewer</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-industrial-900 sm:text-3xl">Report Viewer</h1>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 items-start">
          <div className="w-full sticky top-6">
            <ReportHeader reportMetaData={reportData?.SD_LOG_RECORD?.DCN_SLAVE_DETAILS} />
          </div>
          <div className="w-full overflow-hidden">
            <ReportTable
              error={error}
              loading={loading}
              totalLogs={total_Logs}
              data={reportData}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewPage;