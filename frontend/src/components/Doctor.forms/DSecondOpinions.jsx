

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { formatDistanceToNow } from 'date-fns';
// import Loader from '../ui/Loader';

// // Icons (keeping them the same)
// const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
// const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
// const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
// const StethoscopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 10-7.07 7.071 5 5 0 007.07-7.071z" /></svg>;
// const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
// const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

// export default function DSecondOpinions() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchRequests() {
//       try {
//         console.log("🔍 Fetching second opinion requests...");
//         const res = await axios.get("http://localhost:1600/api/doctor/get-second-opinion", { 
//           withCredentials: true 
//         });
        
//         console.log("✅ API Response received:", res.data);
        
//         const sortedData = (res.data?.data || []).sort((a, b) => {
//           if (a.status === 'pending' && b.status !== 'pending') return -1;
//           if (a.status !== 'pending' && b.status === 'pending') return 1;
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         });
        
//         setRequests(sortedData);
//         setError(null);
//         console.log("✅ Requests loaded successfully:", sortedData.length, "requests");
//       } catch (err) { 
//         console.error("❌ Error fetching requests:", err);
//         console.error("❌ Error response:", err.response?.data);
//         console.error("❌ Error status:", err.response?.status);
//         setError("Could not load second opinion requests. Please try again.");
//       } finally { 
//         setLoading(false); 
//       }
//     }
//     fetchRequests();
//   }, []);

//   const handleResponse = async (id, action) => {
//     console.log(`🚀 Attempting to ${action} request with ID: ${id}`);
//     setUpdatingId(id);
//     setError(null);
    
//     try {
//       // Enhanced logging
//       console.log("📡 Making PUT request to:", `http://localhost:1600/api/doctor/get-second-opinion/${id}`);
//       console.log("📦 Request payload:", { status: action });
//       console.log("🍪 Request cookies will be sent with withCredentials: true");
      
//       const response = await axios.put(
//         `http://localhost:1600/api/doctor/get-second-opinion/${id}`, 
//         { status: action }, 
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log("✅ Update response received:", response.data);
      
//       // Update the local state
//       setRequests((prev) => 
//         prev.map((req) => 
//           req._id === id ? { ...req, status: action } : req
//         )
//       );
      
//       // Show success message
//       alert(`✅ Request ${action} successfully!`);
//       console.log("🎉 State updated successfully");
      
//     } catch (err) { 
//       console.error("❌ =============== DETAILED ERROR INFORMATION ===============");
//       console.error("❌ Full error object:", err);
//       console.error("❌ Error message:", err.message);
//       console.error("❌ Error name:", err.name);
//       console.error("❌ Error code:", err.code);
//       console.error("❌ Request config:", err.config);
      
//       if (err.response) {
//         console.error("❌ Response received with error:");
//         console.error("❌ Response status:", err.response.status);
//         console.error("❌ Response status text:", err.response.statusText);
//         console.error("❌ Response headers:", err.response.headers);
//         console.error("❌ Response data:", err.response.data);
        
//         // 🚨 CRITICAL: Extract the actual backend error message
//         if (err.response.data) {
//           console.error("🚨 Backend error details:", err.response.data);
//           console.error("🚨 Backend error message:", err.response.data.message);
//           console.error("🚨 Backend error object:", err.response.data.error);
          
//           // Show the actual backend error to user
//           const backendErrorMessage = err.response.data.message || 
//                                        err.response.data.error?.message || 
//                                        "Unknown server error";
          
//           alert(`🚨 Backend Error: ${backendErrorMessage}`);
          
//           // Also log the full backend error for debugging
//           if (err.response.data.error) {
//             console.error("🚨 Backend error stack:", err.response.data.error.stack);
//           }
//         }
//       } else if (err.request) {
//         console.error("❌ No response received:");
//         console.error("❌ Request made but no response:", err.request);
//       } else {
//         console.error("❌ Error setting up request:", err.message);
//       }
      
//       // More specific error messages based on status codes
//       let errorMessage = "Something went wrong. Please try again.";
      
//       if (err.response?.status === 401) {
//         errorMessage = "🔐 Authentication failed. Please log in again.";
//         console.error("🔐 Authentication issue - check cookies/tokens");
//       } else if (err.response?.status === 403) {
//         errorMessage = "🚫 You don't have permission to perform this action.";
//         console.error("🚫 Authorization issue - check user permissions");
//       } else if (err.response?.status === 404) {
//         errorMessage = "🔍 Request not found. It may have already been processed.";
//         console.error("🔍 Resource not found - check request ID:", id);
//       } else if (err.response?.status === 500) {
//         // Use the actual backend error message
//         errorMessage = err.response?.data?.message || 
//                        err.response?.data?.error?.message || 
//                        "🔧 Server error. Please contact support.";
//         console.error("🔧 Server error - check backend logs");
//       } else if (!err.response) {
//         errorMessage = "🌐 Network error. Please check your connection.";
//         console.error("🌐 Network issue - no response received");
//       }
      
//       setError(errorMessage);
//       console.error("❌ ========================================================");
//     } finally { 
//       setUpdatingId(null);
//       console.log("🏁 Request handling completed");
//     }
//   };

//   // Enhanced loading state with better return
//   if (loading) {
//     console.log("⏳ Loading requests...");
//     return <Loader />;
//   }

//   // Enhanced error state
//   if (error && requests.length === 0) {
//     console.log("❌ Error state with no requests");
//     return (
//       <div className="bg-slate-50 min-h-screen">
//         <div className="max-w-4xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
//               Review Requests
//             </h1>
//             <div className="mt-8 p-8 bg-red-50 rounded-xl border border-red-200">
//               <h3 className="text-lg font-medium text-red-800">Error Loading Requests</h3>
//               <p className="mt-2 text-sm text-red-600">{error}</p>
//               <button 
//                 onClick={() => {
//                   console.log("🔄 Retrying page reload...");
//                   window.location.reload();
//                 }} 
//                 className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//               >
//                 🔄 Retry
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   console.log("✅ Rendering main component with", requests.length, "requests");

//   return (
//     <div className="bg-slate-50 min-h-screen">
//       <div className="max-w-4xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
//             Review Requests
//           </h1>
//           <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
//             Triage new second opinion requests from your patient portal.
//           </p>
//         </div>

//         {/* Error banner for non-critical errors */}
//         {error && requests.length > 0 && (
//           <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-red-600">{error}</p>
//               <button 
//                 onClick={() => {
//                   console.log("🔄 Clearing error state");
//                   setError(null);
//                 }}
//                 className="text-red-400 hover:text-red-600"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         )}

//         {requests.length > 0 ? (
//           <div className="space-y-8">
//             {requests.map((req, index) => {
//               console.log(`📋 Rendering request ${index + 1}:`, req._id, "Status:", req.status);
//               return (
//                 <RequestCard
//                   key={req._id}
//                   request={req}
//                   isUpdating={updatingId === req._id}
//                   onRespond={handleResponse}
//                 />
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center mt-16 p-8 bg-white rounded-xl shadow-sm border border-slate-200">
//             <div className="text-6xl mb-4">📫</div>
//             <h3 className="text-lg font-medium text-slate-900">Inbox Zero!</h3>
//             <p className="mt-1 text-sm text-slate-500">You have no pending second opinion requests.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function RequestCard({ request, isUpdating, onRespond }) {
//   const isPending = request.status.toLowerCase() === "pending";
//   const status = request.status.toLowerCase();

//   console.log(`📋 Rendering card for request:`, request._id, "isPending:", isPending, "status:", status);

//   const statusStyles = {
//     pending: { sidebar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' },
//     accepted: { sidebar: 'bg-green-500', badge: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' },
//     rejected: { sidebar: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' },
//   };
//   const currentStatus = statusStyles[status] || {
//     sidebar: 'bg-gray-400', 
//     badge: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
//   };

//   const handleButtonClick = (action) => {
//     console.log(`🖱️ Button clicked: ${action} for request:`, request._id);
//     if (isUpdating) {
//       console.log("⏳ Request already updating, ignoring click");
//       return;
//     }
//     onRespond(request._id, action);
//   };

//   return (
//     <div className="group relative bg-white rounded-lg shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-lg hover:border-indigo-400/50">
//       <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg transition-all duration-300 ${currentStatus.sidebar}`}></div>

//       <div className="pl-10 pr-8 py-6">
//         <div className="space-y-6">
//           {/* Header */}
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-xl font-bold text-slate-800">{request.patientId?.name || "N/A"}</h2>
//               <p className="text-sm text-slate-500">
//                 Request received {request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : 'recently'}
//               </p>
//               {/* Debug info - remove in production */}
//               <p className="text-xs text-slate-400 mt-1">ID: {request._id}</p>
//             </div>
//             <div className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${currentStatus.badge}`}>
//               {request.status}
//             </div>
//           </div>

//           {/* Details Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
//             <div className="flex items-start gap-3">
//               <StethoscopeIcon className="text-indigo-400 mt-0.5 flex-shrink-0"/>
//               <div>
//                 <span className="font-medium text-slate-500">Problem: </span>
//                 <span className="text-slate-800">{request.problem || 'N/A'}</span>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <CalendarIcon className="text-indigo-400 mt-0.5 flex-shrink-0"/>
//               <div>
//                 <span className="font-medium text-slate-500">Availability: </span>
//                 <span className="text-slate-800">{request.date || 'N/A'} at {request.time || 'N/A'}</span>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <UserIcon className="text-indigo-400 mt-0.5 flex-shrink-0"/>
//               <div>
//                 <span className="font-medium text-slate-500">Contact: </span>
//                 <span className="text-slate-800">{request.patientId?.contact || 'N/A'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Previous Treatment Section */}
//           <div className="p-4 bg-slate-50 rounded-md border border-slate-200/90">
//             <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Previous Treatment Summary</h3>
//             <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.treatment || "No details were provided."}</p>
//           </div>

//           {/* Files Section */}
//           {request.files?.length > 0 && (
//             <div>
//               <p className="text-sm font-medium text-slate-600 mb-2">Attachments ({request.files.length})</p>
//               <div className="flex flex-wrap gap-2">
//                 {request.files.map((file, index) => (
//                   <a 
//                     key={index} 
//                     href={file} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     onClick={() => console.log(`🔗 Opening attachment ${index + 1}:`, file)}
//                     className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-100 hover:text-indigo-800 hover:ring-1 hover:ring-indigo-300 transition-all duration-200"
//                   >
//                     <LinkIcon />
//                     <span>View Attachment {index + 1}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       {isPending && (
//         <>
//           <hr className="border-slate-200/80"/>
//           <div className="px-8 py-4 bg-slate-50/75 flex justify-end gap-3 rounded-b-lg">
//             <button
//               onClick={() => handleButtonClick("rejected")}
//               disabled={isUpdating}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold text-sm bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isUpdating ? <Spinner /> : <XMarkIcon />}
//               {isUpdating ? "Processing..." : "Reject"}
//             </button>
//             <button
//               onClick={() => handleButtonClick("accepted")}
//               disabled={isUpdating}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-md font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:bg-indigo-400 disabled:cursor-not-allowed min-w-[110px] justify-center"
//             >
//               {isUpdating ? <Spinner /> : <><CheckIcon /> Accept</>}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






























































import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import Loader from "../ui/Loader";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 717.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

const AttachmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 115.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export default function DSecondOpinions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const styles = `
    .modern-container {
      background: #ffffff;
      padding: 1rem;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin-top: 70px;
    }
    
    .header-section {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .title-modern {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    
    .subtitle-modern {
      font-size: 1rem;
      color: #6b7280;
      font-weight: 500;
    }
    
    .controls-bar {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .search-container {
      position: relative;
      flex: 1;
      min-width: 260px;
      max-width: 350px;
    }
    
    /* Beautiful Search Box Styling */
.search-container {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 420px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem 0.875rem 3.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-weight: 500;
  color: #374151;
  outline: none;
}

.search-input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 6px 20px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
  font-style: normal;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.3s ease;
}

.search-container:hover .search-icon {
  color: #6b7280;
}

.search-input:focus ~ .search-icon {
  color: #3b82f6;
}

/* Optional: Add a subtle inner glow effect */
.search-input:focus {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

    
    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      background: #f9fafb;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    
    .filter-btn {
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      border: none;
      background: transparent;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    
    .filter-btn.active {
      background: #3b82f6;
      color: white;
    }
    
    .filter-btn:hover:not(.active) {
      background: #e5e7eb;
      color: #374151;
    }
    
    .stats-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      flex: 1;
      min-width: 150px;
      max-width: 200px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    .requests-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1rem; /* horizontal gap, vertical gap */
  row-gap: 4rem; /* Additional vertical space between rows */
  width: 100%;
  justify-content: center;
}

    .request-card {
      flex: 0 0 calc(25% - 0.75rem); /* Exactly 4 cards per row */
      width: calc(25% - 0.75rem);
      min-width: 280px;
      box-sizing: border-box;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 350px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .request-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }
    
    .request-card.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      min-height: 50px;
    }
    
    .patient-name {
      font-weight: 700;
      font-size: 1.1rem;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    
    .request-time {
      font-size: 0.75rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }
    
    .status-badge {
      padding: 0.3rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
    }
    
    .status-pending {
      background: #f59e0b;
    }
    
    .status-accepted {
      background: #10b981;
    }
    
    .status-rejected {
      background: #ef4444;
    }
    
    .card-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: #374151;
      font-size: 0.9rem;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #f9fafb;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }
    
    .info-row:hover {
      background: #f3f4f6;
    }
    
    .info-icon {
      color: #3b82f6;
      flex-shrink: 0;
    }
    
    .info-label {
      font-weight: 600;
      min-width: 70px;
      color: #4b5563;
      flex-shrink: 0;
    }
    
    .info-value {
      color: #111827;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .treatment-section {
      font-size: 0.85rem;
      font-weight: 600;
      color: #0369a1;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #eff6ff;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .attachments-section {
      font-size: 0.85rem;
      margin-top: 0.5rem;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 0.5rem;
      background: #fef3c7;
      border-radius: 6px;
      border-left: 3px solid #f59e0b;
      
    }
    
    .attachment-label {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 600;
      color: #92400e;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .attachment-link {
      padding: 0.25rem 0.5rem;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      transition: background-color 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .attachment-link:hover {
      background: #2563eb;
    }
    
    .action-buttons {
      margin-top: auto;
      padding-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    
    .btn-accept, .btn-reject {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      transition: all 0.2s ease;
      font-weight: 600;
    }
    
    .btn-accept {
      background: #10b981;
      color: white;
    }
    
    .btn-accept:hover:not(:disabled) {
      background: #059669;
    }
    
    .btn-reject {
      background: #ef4444;
      color: white;
    }
    
    .btn-reject:hover:not(:disabled) {
      background: #dc2626;
    }
    
    .btn-accept:disabled,
    .btn-reject:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 8px;
      border: 2px dashed #d1d5db;
      color: #6b7280;
    }
    
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }
    
    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .error-banner {
      background: #fee2e2;
      border: 1px solid #fca5a5;
      color: #991b1b;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }
    
    .error-close {
      background: none;
      border: none;
      color: #991b1b;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 1.1rem;
      transition: background-color 0.2s ease;
    }
    
    .error-close:hover {
      background: rgba(239, 68, 68, 0.2);
    }
    
    @media (max-width: 1200px) {
      .request-card {
        flex: 0 0 calc(33.333% - 0.67rem);
        width: calc(33.333% - 0.67rem);
      }
    }
    
    @media (max-width: 900px) {
      .request-card {
        flex: 0 0 calc(50% - 0.5rem);
        width: calc(50% - 0.5rem);
      }
    }
    
    @media (max-width: 600px) {
      .modern-container {
        padding: 0.75rem;
      }
      .request-card {
        flex: 0 0 100%;
        width: 100%;
        min-width: auto;
        height: auto;
      }
      .controls-bar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-container {
        max-width: none;
      }
      .stats-bar {
        flex-direction: column;
      }
      .stat-card {
        max-width: none;
      }
    }
  `;

  const formatSchedule = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return format(d, "dd MMM yyyy, HH:mm") + " IST";
    } catch {
      return isoString;
    }
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await axios.get("http://localhost:1600/api/doctor/get-second-opinion", { withCredentials: true });
        const sortedData = (res.data?.data || []).sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setRequests(sortedData);
        setError(null);
      } catch {
        setError("Could not load second opinion requests. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleResponse = async (id, action) => {
    setUpdatingId(id);
    setError(null);
    try {
      await axios.put(`http://localhost:1600/api/doctor/get-second-opinion/${id}`, { status: action }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: action } : r)));
      alert(`✅ Request ${action} successfully!`);
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err.response?.status === 401) msg = "Authentication failed. Please log in again.";
      else if (err.response?.status === 500) msg = err.response?.data?.message || "Server error. Please contact support.";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const filMatch = filter === "all" || req.status.toLowerCase() === filter.toLowerCase();
    const searchMatch = !searchTerm || (req.patientId?.name.toLowerCase().includes(searchTerm.toLowerCase()) || req.problem?.toLowerCase().includes(searchTerm.toLowerCase()));
    return filMatch && searchMatch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status.toLowerCase() === "pending").length,
    accepted: requests.filter((r) => r.status.toLowerCase() === "accepted").length,
    rejected: requests.filter((r) => r.status.toLowerCase() === "rejected").length,
  };

  if (loading) return <Loader />;

  return (
    <>
      <style>{styles}</style>
      <div className="modern-container">
        <div className="header-section">
          <h1 className="title-modern">Second Opinion Requests</h1>
          <p className="subtitle-modern">Review and manage patient consultation requests</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button className="error-close" onClick={() => setError(null)} aria-label="Close error message">
                ×
              </button>
            </div>
          )}

          <div className="controls-bar">
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search patients or problems..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search patients or problems"
              />
            </div>

            <div className="filter-buttons" role="group" aria-label="Filter second opinion requests">
              {["all", "pending", "accepted", "rejected"].map((f) => (
                <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} aria-pressed={filter === f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-bar" aria-label="Second opinion requests statistics">
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#3b82f6" }}>
                {stats.total}
              </div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#f59e0b" }}>
                {stats.pending}
              </div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#10b981" }}>
                {stats.accepted}
              </div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#ef4444" }}>
                {stats.rejected}
              </div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="requests-grid" role="list">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  isUpdating={updatingId === request._id}
                  isSelected={selectedCard === request._id}
                  onSelect={setSelectedCard}
                  onRespond={handleResponse}
                  formatSchedule={formatSchedule}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" role="alert">
              <div className="empty-icon">🩺</div>
              <h3 className="empty-title">No requests found</h3>
              <p className="empty-description">{searchTerm || filter !== "all" ? "Try adjusting your search or filter criteria" : "You have no second opinion requests at the moment"}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function RequestCard({ request, isUpdating, isSelected, onSelect, onRespond, formatSchedule }) {
  const isPending = request.status.toLowerCase() === "pending";
  const status = request.status.toLowerCase();

  const handleCardClick = () => {
    onSelect(isSelected ? null : request._id);
  };

  const handleButtonClick = (action, e) => {
    e.stopPropagation();
    if (isUpdating) return;
    onRespond(request._id, action);
  };

  return (
    <div
      className={`request-card ${isSelected ? "selected" : ""}`}
      onClick={handleCardClick}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-expanded={isSelected}
      aria-label={`Second opinion request from ${request.patientId?.name || "patient"}`}
    >
      <div className="card-header">
        <div>
          <h3 className="patient-name" title={request.patientId?.name}>
            {request.patientId?.name || "N/A"}
          </h3>
          <div className="request-time" title={new Date(request.createdAt).toLocaleString()}>
            <ClockIcon />
            {request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : "Recently"}
          </div>
        </div>
        <div className={`status-badge status-${status}`} title={request.status}>
          {request.status}
        </div>
      </div>

      <div className="card-content">
        <div className="info-row">
          <StethoscopeIcon className="info-icon" />
          <span className="info-label">Problem:</span>
          <span className="info-value" title={request.problem}>
            {request.problem || "N/A"}
          </span>
        </div>

        <div className="info-row">
          <CalendarIcon className="info-icon" />
          <span className="info-label">Schedule:</span>
          <span className="info-value" title={formatSchedule(request.date)}>
            {formatSchedule(request.date)}
          </span>
        </div>

        <div className="info-row">
          <UserIcon className="info-icon" />
          <span className="info-label">Contact:</span>
          <span className="info-value" title={request.patientId?.contact}>
            {request.patientId?.contact || "N/A"}
          </span>
        </div>

        {request.treatment && (
          <div className="treatment-section" title={request.treatment}>
            Previous Treatment: {request.treatment.length > 40 ? request.treatment.slice(0, 40) + "…" : request.treatment}
          </div>
        )}

        {request.files?.length > 0 && (
          <div className="attachments-section" aria-label="Attachments">
            <div className="attachment-label">
              <AttachmentIcon /> Attachments:
            </div>
            {request.files.map((file, i) => (
              <a
                key={i}
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-link"
                aria-label={`Attachment document ${i + 1}`}
                onClick={(e) => e.stopPropagation()}
              >
                Doc {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      {isPending && (
        <div className="action-buttons">
          <button
            className="btn-reject"
            onClick={(e) => handleButtonClick("rejected", e)}
            disabled={isUpdating}
            aria-disabled={isUpdating}
            aria-label={`Reject request from ${request.patientId?.name || "patient"}`}
          >
            {isUpdating ? <div className="loading-spinner" /> : <XMarkIcon />}
            Reject
          </button>

          <button
            className="btn-accept"
            onClick={(e) => handleButtonClick("accepted", e)}
            disabled={isUpdating}
            aria-disabled={isUpdating}
            aria-label={`Accept request from ${request.patientId?.name || "patient"}`}
          >
            {isUpdating ? <div className="loading-spinner" /> : <CheckIcon />}
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
