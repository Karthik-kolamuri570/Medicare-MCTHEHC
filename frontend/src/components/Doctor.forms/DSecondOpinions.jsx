// import React, { useState } from "react";

// const secondOpinionRequests = [
//   {
//     id: 1,
//     patientName: "Alice Johnson",
//     problem: "Chronic migraine",
//     availability: { from: "10:00 AM", to: "12:00 PM" },
//     mode: "Online",
//     contact: "alice.johnson@example.com",
//     previousTreatment: "Prescribed triptans, asked to track triggers.",
//     records: "report1.pdf"
//   },
//   {
//     id: 1,
//     patientName: "Alice Johnson",
//     problem: "Chronic migraine",
//     availability: { from: "10:00 AM", to: "12:00 PM" },
//     mode: "Online",
//     contact: "alice.johnson@example.com",
//     previousTreatment: "Prescribed triptans, asked to track triggers.",
//     records: "report1.pdf"
//   },
//   {
//     id: 1,
//     patientName: "Alice Johnson",
//     problem: "Chronic migraine",
//     availability: { from: "10:00 AM", to: "12:00 PM" },
//     mode: "Online",
//     contact: "alice.johnson@example.com",
//     previousTreatment: "Prescribed triptans, asked to track triggers.",
//     records: "report1.pdf"
//   },
//   {
//     id: 1,
//     patientName: "Alice Johnson",
//     problem: "Chronic migraine",
//     availability: { from: "10:00 AM", to: "12:00 PM" },
//     mode: "Online",
//     contact: "alice.johnson@example.com",
//     previousTreatment: "Prescribed triptans, asked to track triggers.",
//     records: "report1.pdf"
//   },
//   {
//     id: 1,
//     patientName: "Alice Johnson",
//     problem: "Chronic migraine",
//     availability: { from: "10:00 AM", to: "12:00 PM" },
//     mode: "Online",
//     contact: "alice.johnson@example.com",
//     previousTreatment: "Prescribed triptans, asked to track triggers.",
//     records: "report1.pdf"
//   },
// ];

// function DSecondOpinions() {
//   const [requests, setRequests] = useState(secondOpinionRequests);

//   const handleResponse = (id, action) => {
//     alert(`Request ID ${id} has been ${action}`);
//     setRequests((prev) => prev.filter((req) => req.id !== id));
//   };

//   return (
//           <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "600px",
//       backgroundColor: "#f8f9fa",
//     }}>
//     <div style={{ padding: "2rem" }}>
//       <h2 style={{ marginBottom: "1.5rem" }}>Get Second Opinion</h2>

//       {requests.map((req) => (
//         <div
//           key={req.id}
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             border: "1px solid #ccc",
//             borderRadius: "10px",
//             padding: "1.5rem",
//             marginBottom: "1.5rem",
//             boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//             gap: "2rem"
//           }}
//         >
//           {/* Left: Details */}
//           <div style={{ flex: 1 }}>
//             <p><strong>Patient Name:</strong> {req.patientName}</p>
//             <p><strong>Problem:</strong> {req.problem}</p>
//             <p><strong>Availability:</strong> {req.availability.from} - {req.availability.to}</p>
//             <p><strong>Mode:</strong> {req.mode}</p>
//             <p><strong>Phone or Email:</strong> {req.contact}</p>
//             <p><strong>Files and Medical Records:</strong> {req.records}</p>
//             <p><strong>Previous Treatment:</strong></p>
//             <textarea
//               value={req.previousTreatment}
//               readOnly
//               style={{
//                 width: "100%",
//                 height: "80px",
//                 padding: "0.5rem",
//                 resize: "none",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px"
//               }}
//             />
//           </div>

//           {/* Right: Actions */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//             <button
//               style={{
//                 padding: "0.75rem 1.5rem",
//                 backgroundColor: "#28a745",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer"
//               }}
//               onClick={() => handleResponse(req.id, "accepted")}
//             >
//               Accept
//             </button>
//             <button
//               style={{
//                 padding: "0.75rem 1.5rem",
//                 backgroundColor: "#dc3545",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer"
//               }}
//               onClick={() => handleResponse(req.id, "rejected")}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}

//       {requests.length === 0 && (
//         <p style={{ color: "#666", textAlign: "center" }}>No more second opinion requests.</p>
//       )}
//     </div>
//     </div>
//   );
// }

// export default DSecondOpinions;









import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';

// --- Icons (No changes needed here) ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const StethoscopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 10-7.07 7.071 5 5 0 007.07-7.071z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;
import Loader from '../ui/Loader';

export default function DSecondOpinions() {
  // --- All logic remains exactly the same ---
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await axios.get("http://localhost:1600/api/doctor/get-second-opinion", { withCredentials: true });
        const sortedData = (res.data?.data || []).sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setRequests(sortedData);
      } catch (err) { console.error(err); alert("Could not load second opinion requests."); }
      finally { setLoading(false); }
    }
    fetchRequests();
  }, []);

  const handleResponse = async (id, action) => {
    setUpdatingId(id);
    try {
      await axios.put(`http://localhost:1600/api/doctor/get-second-opinion/${id}`, { status: action }, { withCredentials: true });
      setRequests((prev) => prev.map((req) => (req._id === id ? { ...req, status: action } : req)));
    } catch (err) { console.error(err); alert("Something went wrong. Please try again."); }
    finally { setUpdatingId(null); }
  };

  if (loading) {
    <Loader />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* IMPROVEMENT: Increased page padding for more breathing room */}
      <div className="max-w-4xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Review Requests
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
            Triage new second opinion requests from your patient portal.
            </p>
        </div>

        {requests.length > 0 ? (
          // IMPROVEMENT: Increased space between cards
          <div className="space-y-8">
            {requests.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                isUpdating={updatingId === req._id}
                onRespond={handleResponse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-16 p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">Inbox Zero!</h3>
            <p className="mt-1 text-sm text-slate-500">You have no pending second opinion requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, isUpdating, onRespond }) {
    const isPending = request.status.toLowerCase() === "pending";
    const status = request.status.toLowerCase();
  
    const statusStyles = {
      pending: { sidebar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20', },
      accepted: { sidebar: 'bg-green-500', badge: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20', },
      rejected: { sidebar: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20', },
    };
    const currentStatus = statusStyles[status] || {};
  
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-lg hover:border-indigo-400/50">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg transition-all duration-300 ${currentStatus.sidebar}`}></div>
  
        {/* IMPROVEMENT: Increased card padding */}
        <div className="pl-10 pr-8 py-6">
          {/* IMPROVEMENT: Consistent vertical rhythm with space-y-6 */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{request.patientId?.name || "N/A"}</h2>
                    <p className="text-sm text-slate-500">
                        Request received {request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : 'recently'}
                    </p>
                </div>
                <div className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${currentStatus.badge}`}>
                    {request.status}
                </div>
            </div>
  
            {/* Details Grid - Synchronized gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                <div className="flex items-start gap-3">
                    <StethoscopeIcon className="text-indigo-400 mt-0.5"/>
                    <p><span className="font-medium text-slate-500">Problem: </span><span className="text-slate-800">{request.problem}</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <CalendarIcon className="text-indigo-400 mt-0.5"/>
                    <p><span className="font-medium text-slate-500">Availability: </span><span className="text-slate-800">{request.date} at {request.time}</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <UserIcon className="text-indigo-400 mt-0.5"/>
                    <p><span className="font-medium text-slate-500">Contact: </span><span className="text-slate-800">{request.patientId?.contact || 'N/A'}</span></p>
                </div>
            </div>

            {/* Previous Treatment Section */}
            <div className="p-4 bg-slate-50 rounded-md border border-slate-200/90">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Previous Treatment Summary</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.treatment || "No details were provided."}</p>
            </div>

            {/* Files Section */}
            {request.files?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Attachments</p>
              <div className="flex flex-wrap gap-2">
                {request.files.map((file, index) => (
                  <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-100 hover:text-indigo-800 hover:ring-1 hover:ring-indigo-300 transition-all duration-200">
                    <LinkIcon />
                    <span>View Attachment {index + 1}</span>
                  </a>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
  
        {/* IMPROVEMENT: Clear separation with a horizontal rule */}
        {isPending && (
          <>
            <hr className="border-slate-200/80"/>
            {/* IMPROVEMENT: Increased padding in footer */}
            <div className="px-8 py-4 bg-slate-50/75 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => onRespond(request._id, "rejected")}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold text-sm bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-60 disabled:cursor-wait"
              >
                <XMarkIcon /> Reject
              </button>
              <button
                onClick={() => onRespond(request._id, "accepted")}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:bg-indigo-400 disabled:cursor-wait min-w-[110px] justify-center"
              >
                {isUpdating ? <Spinner /> : <><CheckIcon /> Accept</>}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }