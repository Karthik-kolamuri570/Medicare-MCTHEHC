// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { CheckCircle } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PaymentSuccess = () => {
//   useEffect(() => {
//     toast.success('🎉 Payment Successful! Appointment Confirmed.', {
//       position: 'top-center',
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: 'colored',
//     });
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center p-6">
//       <ToastContainer />
//       <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center space-y-6">
//         <CheckCircle className="mx-auto text-green-600 w-20 h-20 animate-pulse" />
//         <h1 className="text-3xl font-extrabold text-green-700">Payment Successful 🎉</h1>
//         <p className="text-gray-600">
//           Your appointment is confirmed. You’ll receive a confirmation email shortly.
//         </p>
//         <Link
//           to="/"
//           className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
//         >
//           🏠 Back to Homepage
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;





// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        console.log("session_id:", sessionId); // 👈 this should show a valid ID


    if (!sessionId) {
      toast.error("Invalid session ID. Please contact support.");
      return navigate("/");
    }

    toast.success("🎉 Payment Successful! Your appointment is confirmed.", {
      position: "top-center",
      autoClose: 5000,
    });

  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 mb-6">
          Your consultation has been booked successfully. We'll send you the details shortly.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
