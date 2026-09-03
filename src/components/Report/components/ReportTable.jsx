import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import Button from "../../ui/Button";
import { ChevronLeft, FileText, Database, Loader2 } from "lucide-react";

const ReportTable = ({ data, page, rowsPerPage, setPage, setRowsPerPage, totalLogs, loading, error }) => {
  const navigate = useNavigate();
  const logs = data?.SD_LOG_RECORD?.REPORT_LOGS || [];
  const headers = data?.SD_LOG_RECORD?.LOGS_HEADER || [];

  const startLog = (page - 1) * rowsPerPage + 1;
  const endLog = Math.min(startLog + rowsPerPage - 1, totalLogs);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-industrial-100 shadow-industrial-sm">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="mt-4 text-industrial-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading Logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100 shadow-industrial-sm">
        <p className="text-red-500 font-black tracking-widest uppercase text-sm">Failed to retrieve log data</p>
        <p className="mt-2 text-red-400 text-xs font-semibold">{error}</p>
        <Button 
          label="RETRY" 
          variant="danger" 
          className="mt-6" 
          onClick={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-industrial-lg border border-industrial-200 overflow-hidden">
      {/* Table Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 gap-6 border-b border-industrial-100 bg-industrial-50/30">
        <div className="flex items-center gap-6">
          <Button 
            label="GO BACK" 
            icon={ChevronLeft} 
            variant="secondary" 
            className="group"
            onClick={() => navigate(-1)} 
          />
          <div className="h-8 w-[2px] bg-industrial-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-industrial-400 font-black tracking-[0.2em] uppercase leading-none mb-1">Status</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[10px] font-black tracking-wider uppercase">Page {page}</span>
              <span className="text-industrial-900 font-black text-sm tracking-tight uppercase">Live Review</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-100 rounded-lg text-industrial-600">
            <FileText size={18} />
          </div>
          <h2 className="text-xl font-black text-industrial-900 uppercase tracking-tighter">LOG DATA</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-industrial-400 font-black tracking-[0.2em] uppercase leading-none mb-1">Total Records</span>
            <div className="flex items-center gap-2 text-industrial-900">
               <Database size={14} className="text-orange-500" />
               <span className="font-mono font-bold text-lg leading-none">{totalLogs}</span>
            </div>
          </div>
          <div className="h-10 w-[2px] bg-industrial-200"></div>
          <div className="bg-industrial-900 text-white px-4 py-2 rounded-xl shadow-lg border border-gray-800">
            <span className="font-mono text-sm tracking-tight font-bold">{startLog}-{endLog}</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto relative custom-scrollbar">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr className="bg-industrial-100">
              <th className="border-b border-r border-industrial-200 p-4 text-left text-[11px] font-black text-industrial-500 uppercase tracking-[0.15em] whitespace-nowrap bg-industrial-100">
                SR_NO
              </th>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="border-b border-r border-industrial-200 p-4 text-left text-[11px] font-black text-industrial-500 uppercase tracking-[0.15em] whitespace-nowrap bg-industrial-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-industrial-100">
            {logs.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="group transition-all duration-200 hover:bg-orange-50/60 relative"
              >
                <td className="p-4 text-sm font-mono font-bold text-industrial-600 border-r border-industrial-100/50 bg-industrial-50/30 group-hover:bg-transparent relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {startLog + rowIndex}
                </td>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="p-4 text-sm font-medium text-industrial-800 border-r border-industrial-100/50 max-w-[200px] truncate group-hover:text-orange-950 transition-colors"
                  >
                    {cell || <span className="text-industrial-300 opacity-50 italic">N/A</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-industrial-50/30 border-t border-industrial-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[10px] text-industrial-400 font-bold uppercase tracking-widest whitespace-nowrap">
          Viewing <span className="text-industrial-900">{logs.length}</span> entries per page
        </div>
        
        <div className="flex-grow flex justify-center">
          <Pagination
            count={Math.ceil(totalLogs / rowsPerPage)}
            page={page}
            onChange={(event, value) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setPage(value);
            }}
            size="medium"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: '#111827',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1f2937',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              },
            }}
          />
        </div>

        <div className="hidden sm:block">
           <div className="w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;