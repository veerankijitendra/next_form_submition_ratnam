"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Submission {
  _id: string;
  name: string;
  firmName: string;
  address: string;
  mobile: string;
  gst?: string;
  dealingIn: string;
  createdAt: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/form");
        const data = await res.json();
        if (data.success && isMounted) {
          setSubmissions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSubmissions();
    return () => { isMounted = false; };
  }, []);

  const handleClearData = async () => {
    if (confirm("This will permanently delete all records. Are you sure?")) {
      try {
        const res = await fetch("/api/form", { method: "DELETE" });
        if (res.ok) {
          setSubmissions([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Failed to clear data", error);
      }
    }
  };

  const handleDownloadCSV = () => {
    if (!submissions.length) {
      alert("No data to download yet.");
      return;
    }
    const headers = ["#", "Name", "Firm Name", "Mobile", "GST Number", "Address", "Dealing In", "Date"];
    const rows = submissions.map((e, i) => [
      i + 1,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.firmName.replace(/"/g, '""')}"`,
      e.mobile,
      e.gst || "",
      `"${e.address.replace(/"/g, '""')}"`,
      `"${e.dealingIn.replace(/"/g, '""')}"`,
      new Date(e.createdAt).toLocaleString("en-IN")
    ].join(","));
    
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "business_registrations_" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
  };

  // Pagination Logic
  const totalPages = Math.ceil(submissions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = submissions.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Failed to log out", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 font-roboto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] font-inter">Admin Dashboard</h2>
          <p className="text-[15px] text-[#334155] mt-1">Manage and view all business registrations.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={handleDownloadCSV} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-[0.98] transition-all font-inter shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button onClick={handleClearData} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium bg-white border border-[#CBD5E1] text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#FECACA] active:scale-[0.98] transition-all font-inter shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Clear Data
          </button>
          <button onClick={handleLogout} disabled={isLoggingOut} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] active:scale-[0.98] transition-all font-inter shadow-sm disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-[14px] p-5 shadow-sm border border-[#CBD5E1]">
          <div className="text-[14px] font-medium text-[#334155] mb-1.5 font-roboto">Total Registrations</div>
          <div className="text-3xl font-semibold text-[#0F172A] font-inter">{submissions.length}</div>
        </div>
        <div className="bg-white rounded-[14px] p-5 shadow-sm border border-[#CBD5E1]">
          <div className="text-[14px] font-medium text-[#334155] mb-1.5 font-roboto">GST Registered Firms</div>
          <div className="text-3xl font-semibold text-[#3B82F6] font-inter">{submissions.filter(s => s.gst && s.gst.length > 0).length}</div>
        </div>
      </div>

      <div className="rounded-[14px] border border-[#CBD5E1] shadow-sm bg-white overflow-hidden w-full flex flex-col">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-left border-collapse min-w-[1200px]">
            <TableHeader className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-[#CBD5E1] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter w-[60px]">#</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[150px]">Name</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[180px]">Firm Name</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[150px]">Mobile</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[150px]">GST Number</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[250px]">Dealing In</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[200px]">Address</TableHead>
                <TableHead className="text-[#334155] font-medium px-5 py-4 text-[13px] uppercase tracking-wider font-inter min-w-[150px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-[#334155] font-medium">Loading records...</TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-[#334155] font-medium">No records found. New submissions will appear here.</TableCell>
                </TableRow>
              ) : (
                currentData.map((sub, i) => (
                  <TableRow key={sub._id} className="transition-colors hover:bg-[#F8FAFC] border-b border-[#CBD5E1] last:border-0">
                    <TableCell className="px-5 py-4 text-[14px] text-[#334155]">{startIndex + i + 1}</TableCell>
                    <TableCell className="px-5 py-4 text-[14px] font-medium text-[#0F172A]">{sub.name}</TableCell>
                    <TableCell className="px-5 py-4 text-[14px] text-[#0F172A] font-medium">{sub.firmName}</TableCell>
                    <TableCell className="px-5 py-4 text-[14px] text-[#334155]">{sub.mobile}</TableCell>
                    <TableCell className="px-5 py-4">
                      {sub.gst ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">
                          {sub.gst}
                        </span>
                      ) : (
                        <span className="text-[#334155]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-[14px] text-[#334155] break-words">{sub.dealingIn}</TableCell>
                    <TableCell className="px-5 py-4 text-[14px] text-[#334155] break-words">{sub.address}</TableCell>
                    <TableCell className="px-5 py-4 text-[13px] text-[#334155] whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleString("en-IN", { hour12: true, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && submissions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-[#CBD5E1] gap-4">
            <div className="text-[14px] text-[#334155] font-roboto">
              Showing <span className="font-medium text-[#0F172A]">{startIndex + 1}</span>–<span className="font-medium text-[#0F172A]">{Math.min(startIndex + rowsPerPage, submissions.length)}</span> of <span className="font-medium text-[#0F172A]">{submissions.length}</span> records
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#334155] font-roboto">Rows per page:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={handleRowsPerPageChange}
                  className="border border-[#CBD5E1] rounded-[6px] px-2.5 py-1.5 text-[14px] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all cursor-pointer font-medium"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-[#CBD5E1] rounded-[6px] bg-white text-[#334155] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className="px-3 py-1.5 font-medium text-[#0F172A] text-[14px] min-w-[3rem] text-center">
                  {currentPage}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 border border-[#CBD5E1] rounded-[6px] bg-white text-[#334155] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
