// import React from 'react';
// import { XCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const PaymentCancel = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-100 to-rose-50 flex items-center justify-center p-6">
//       <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center space-y-6">
//         <XCircle className="mx-auto text-red-600 w-20 h-20 animate-pulse" />
//         <h1 className="text-3xl font-extrabold text-red-700">Payment Failed</h1>
//         <p className="text-gray-600">
//           Something went wrong while processing your payment. Don’t worry — your card wasn’t charged.
//         </p>
//         <p className="text-gray-500 text-sm italic">Try again or use a different payment method.</p>
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
//           <Link
//             to="/appointments"
//             className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
//           >
//             🔁 Try Again
//           </Link>
//           <Link
//             to="/"
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
//           >
//             🏠 Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentCancel;



// src/pages/PaymentCancel.jsx
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("❌ Payment Canceled. You can try again anytime.", {
      position: "top-center",
      autoClose: 5000,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Canceled</h1>
        <p className="text-gray-700 mb-6">
          It looks like you canceled the payment. No appointment was booked.
        </p>
        <button
          onClick={() => navigate("/appointments")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
