"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Submission {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  age?: string;
  items: string;
  total?: number;
  payment?: string;
  notes?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    if (confirm("This will permanently delete all customer entries. Are you sure?")) {
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
    const headers = ["#", "Name", "Phone", "Email", "City", "Age Group", "Items", "Total (₹)", "Payment", "Time", "Notes"];
    const rows = submissions.map((e, i) => [
      i + 1,
      e.name,
      e.phone,
      e.email || "",
      e.city || "",
      e.age || "",
      `"${e.items.replace(/"/g, '""')}"`,
      e.total || 0,
      e.payment || "",
      new Date(e.createdAt).toLocaleString("en-IN"),
      `"${(e.notes || "").replace(/"/g, '""')}"`
    ].join(","));
    
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clothing_stall_" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
  };

  const totalRevenue = submissions.reduce((sum, s) => sum + (s.total || 0), 0);
  const upiCount = submissions.filter(s => s.payment === "UPI").length;
  const cashCount = submissions.filter(s => s.payment === "Cash").length;

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

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-[14px] shadow-sm border border-[#D3D1C7] font-roboto">
      <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
        <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#0F6E56] font-inter">Admin Portal</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleDownloadCSV} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[14px] font-medium bg-[#0F6E56] text-white hover:opacity-90 active:scale-95 transition-all font-inter">
            ⬇ Download CSV
          </button>
          <button onClick={handleClearData} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[14px] font-medium border-[1.5px] border-[#D3D1C7] text-[#D3302F] hover:bg-red-50 active:scale-95 transition-all font-inter">
            🗑 Clear Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#E1F5EE] rounded-[10px] p-4 sm:p-5 shadow-sm">
          <div className="text-[13px] font-medium text-[#0F6E56] mb-1">Total Customers</div>
          <div className="text-[24px] font-semibold text-[#0F6E56] font-inter">{submissions.length}</div>
        </div>
        <div className="bg-[#E1F5EE] rounded-[10px] p-4 sm:p-5 shadow-sm">
          <div className="text-[13px] font-medium text-[#0F6E56] mb-1">Total Revenue</div>
          <div className="text-[24px] font-semibold text-[#0F6E56] font-inter">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-[#E1F5EE] rounded-[10px] p-4 sm:p-5 shadow-sm">
          <div className="text-[13px] font-medium text-[#0F6E56] mb-1">UPI Payments</div>
          <div className="text-[24px] font-semibold text-[#0F6E56] font-inter">{upiCount}</div>
        </div>
        <div className="bg-[#E1F5EE] rounded-[10px] p-4 sm:p-5 shadow-sm">
          <div className="text-[13px] font-medium text-[#0F6E56] mb-1">Cash Payments</div>
          <div className="text-[24px] font-semibold text-[#0F6E56] font-inter">{cashCount}</div>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#D3D1C7] shadow-sm bg-white overflow-hidden w-full flex flex-col">
        <div className="overflow-x-auto w-full">
          <Table className="w-full text-left border-collapse min-w-[900px]">
            <TableHeader className="bg-[#0F6E56] shadow-sm">
              <TableRow className="hover:bg-[#0F6E56] border-none">
                <TableHead className="text-white font-medium px-4 py-3 font-inter w-[50px]">#</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[120px]">Name</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[110px]">Phone</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[150px]">Email</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[100px]">City</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[200px]">Items</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter w-[100px]">Amount</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter w-[100px]">Payment</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[140px]">Time</TableHead>
                <TableHead className="text-white font-medium px-4 py-3 font-inter min-w-[200px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-[#888780] font-medium">Loading entries...</TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-[#888780] font-medium">No entries yet — customer submissions will appear here.</TableCell>
                </TableRow>
              ) : (
                currentData.map((sub, i) => (
                  <TableRow key={sub._id} className="transition-colors hover:bg-[#F1EFE8] border-b border-[#EAE8DF] last:border-0">
                    <TableCell className="px-4 py-3 text-[#5F5E5A]">{startIndex + i + 1}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-[#2C2C2A]">{sub.name}</TableCell>
                    <TableCell className="px-4 py-3 text-[#2C2C2A]">{sub.phone}</TableCell>
                    <TableCell className="px-4 py-3 text-[#5F5E5A] truncate max-w-[150px]" title={sub.email || ""}>{sub.email || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-[#5F5E5A]">{sub.city || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-[#2C2C2A] break-words">{sub.items}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-[#2C2C2A]">₹{sub.total || 0}</TableCell>
                    <TableCell className="px-4 py-3">
                      {sub.payment ? (
                        <Badge className="bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#E1F5EE] border-transparent px-2.5 py-0.5 rounded-full font-medium text-[11px] font-inter">
                          {sub.payment}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[12px] text-[#888780] whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleString("en-IN", { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[13px] text-[#5F5E5A] break-words" title={sub.notes}>
                      {sub.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && submissions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-[#F9F9F9] border-t border-[#D3D1C7] gap-3">
            <div className="text-[13px] text-[#5F5E5A]">
              Showing <span className="font-semibold text-[#2C2C2A]">{startIndex + 1}</span> to <span className="font-semibold text-[#2C2C2A]">{Math.min(startIndex + rowsPerPage, submissions.length)}</span> of <span className="font-semibold text-[#2C2C2A]">{submissions.length}</span> records
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#5F5E5A]">Rows:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={handleRowsPerPageChange}
                  className="border border-[#D3D1C7] rounded px-2 py-1 text-[13px] bg-white text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#D3D1C7] rounded bg-white text-[#2C2C2A] text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F1EFE8] transition-colors"
                >
                  Prev
                </button>
                <div className="px-3 py-1 bg-[#E1F5EE] text-[#0F6E56] font-semibold text-[13px] rounded">
                  {currentPage} / {totalPages || 1}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-[#D3D1C7] rounded bg-white text-[#2C2C2A] text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F1EFE8] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
