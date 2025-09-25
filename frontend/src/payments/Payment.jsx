// import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";

// // Load your Stripe public key
// const stripePromise = loadStripe("pk_test_51Rs6m3KeDTOPdy8SRB04YzOvSB4bvxRzzsYczXEkiqEaQudbkvOgEsuKSz3kZw9fdW4RIZqJL9yrlh38fEfWsewO002ISFw1tt"); 

// const Payment = ({ appointment }) => {
//   const handlePayment = async () => {
//     try {
//       console.log("Appointmnt Payment Details...",appointment);
//       const res = await axios.post(
//         "http://localhost:1600/api/payment/check-out",
//         {
//           appointmentId: appointment._id,
//           patientEmail: appointment.email,
//           doctorName: appointment.doctorName,
//           price: appointment.price,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     //   console.log({ appointmentId, patientEmail, doctorName, price });

//       const stripe = await stripePromise;
//       if (!stripe) {
//       console.error("Stripe failed to load");
//       alert("Stripe failed to load. Please try again later.");
//       return;
//     }

//       await stripe.redirectToCheckout({ sessionId: res.data.id });
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Payment initiation failed. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-6 shadow-md rounded-lg border">
//       <h2 className="text-2xl font-semibold mb-4">
//         Payment for Consultation
//       </h2>
//       <p className="text-gray-600 mb-2">
//         Doctor: Dr. {appointment.doctorName}
//       </p>
//       <p className="text-gray-600 mb-2">Date: {appointment.date}</p>
//       <p className="text-gray-600 mb-4">Fee: ₹{appointment.price}</p>

//       <button
//         onClick={handlePayment}
//         className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// };

// export default Payment;




















import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Load your Stripe public key
const stripePromise = loadStripe("pk_test_51Rs6m3KeDTOPdy8SRB04YzOvSB4bvxRzzsYczXEkiqEaQudbkvOgEsuKSz3kZw9fdW4RIZqJL9yrlh38fEfWsewO002ISFw1tt"); 

const Payment = ({ appointment }) => {
  const handlePayment = async () => {
    try {
      console.log("Appointmnt Payment Details...",appointment);
      const res = await axios.post(
        "http://localhost:1600/api/payment/check-out",
        {
          appointmentId: appointment._id,
          patientEmail: appointment.email,
          doctorName: appointment.doctorName,
          price: appointment.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const stripe = await stripePromise;
      if (!stripe) {
      console.error("Stripe failed to load");
      alert("Stripe failed to load. Please try again later.");
      return;
    }

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  // All styles defined inline
  const styles = {
    paymentContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '3rem 1rem',
    },
    paymentWrapper: {
      maxWidth: '28rem',
      margin: '0 auto',
    },
    paymentHeader: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    paymentIconContainer: {
      width: '5rem',
      height: '5rem',
      margin: '0 auto 1rem auto',
      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    paymentIcon: {
      width: '2.5rem',
      height: '2.5rem',
      color: 'white',
    },
    paymentTitle: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    paymentSubtitle: {
      color: '#6b7280',
      fontSize: '1rem',
    },
    paymentCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
    },
    paymentCardHeader: {
      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      padding: '1.5rem 2rem',
    },
    paymentCardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      margin: '0',
    },
    paymentCardTitleSvg: {
      width: '1.5rem',
      height: '1.5rem',
      marginRight: '0.75rem',
    },
    paymentCardBody: {
      padding: '1.5rem 2rem',
    },
    doctorInfo: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
    },
    doctorAvatar: {
      width: '3rem',
      height: '3rem',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
    },
    doctorAvatarSvg: {
      width: '1.5rem',
      height: '1.5rem',
      color: 'white',
    },
    doctorDetailsTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      margin: '0 0 0.25rem 0',
    },
    doctorDetailsName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0',
    },
    appointmentDetails: {
      marginBottom: '1.5rem',
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f3f4f6',
    },
    detailLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    detailIcon: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem',
    },
    detailIconDate: {
      background: '#dbeafe',
    },
    detailIconFee: {
      background: '#dcfce7',
    },
    detailIconSvg: {
      width: '1rem',
      height: '1rem',
    },
    detailIconDateSvg: {
      width: '1rem',
      height: '1rem',
      color: '#2563eb',
    },
    detailIconFeeSvg: {
      width: '1rem',
      height: '1rem',
      color: '#16a34a',
    },
    detailInfoTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      margin: '0 0 0.125rem 0',
    },
    detailInfoValue: {
      color: '#1f2937',
      fontWeight: '500',
      margin: '0',
    },
    totalSection: {
      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #93c5fd',
      marginBottom: '1.5rem',
    },
    totalContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLeftTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      margin: '0 0 0.25rem 0',
    },
    totalLeftAmount: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0',
    },
    totalIcon: {
      color: '#2563eb',
    },
    totalIconSvg: {
      width: '2rem',
      height: '2rem',
    },
    paymentButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      color: 'white',
      fontWeight: '600',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
    paymentButtonSvg: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.75rem',
    },
    securityNotice: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '1rem',
    },
    securityNoticeSvg: {
      width: '1rem',
      height: '1rem',
      color: '#16a34a',
      marginRight: '0.5rem',
    },
    paymentFooter: {
      textAlign: 'center',
      marginTop: '2rem',
      color: '#6b7280',
    },
    paymentFooterText: {
      fontSize: '0.875rem',
      margin: '0',
    },
  };

  const handleButtonHover = (e) => {
    e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #4338ca)';
    e.target.style.transform = 'scale(1.02)';
    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.background = 'linear-gradient(135deg, #2563eb, #4f46e5)';
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
  };

  return (
    <div style={styles.paymentContainer}>
      <div style={styles.paymentWrapper}>
        {/* Header */}
        <div style={styles.paymentHeader}>
          <div style={styles.paymentIconContainer}>
            <svg style={styles.paymentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 style={styles.paymentTitle}>Secure Payment</h1>
          <p style={styles.paymentSubtitle}>Complete your consultation booking</p>
        </div>

        {/* Payment Card */}
        <div style={styles.paymentCard}>
          {/* Card Header */}
          <div style={styles.paymentCardHeader}>
            <h2 style={styles.paymentCardTitle}>
              <svg style={styles.paymentCardTitleSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Consultation Details
            </h2>
          </div>

          {/* Card Body */}
          <div style={styles.paymentCardBody}>
            {/* Doctor Info */}
            <div style={styles.doctorInfo}>
              <div style={styles.doctorAvatar}>
                <svg style={styles.doctorAvatarSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 style={styles.doctorDetailsTitle}>Consulting Doctor</h3>
                <p style={styles.doctorDetailsName}>Dr. {appointment.doctorName}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div style={styles.appointmentDetails}>
              <div style={styles.detailRow}>
                <div style={styles.detailLeft}>
                  <div style={{...styles.detailIcon, ...styles.detailIconDate}}>
                    <svg style={styles.detailIconDateSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 style={styles.detailInfoTitle}>Appointment Date</h4>
                    <p style={styles.detailInfoValue}>{appointment.date}</p>
                  </div>
                </div>
              </div>

              <div style={styles.detailRow}>
                <div style={styles.detailLeft}>
                  <div style={{...styles.detailIcon, ...styles.detailIconFee}}>
                    <svg style={styles.detailIconFeeSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 style={styles.detailInfoTitle}>Consultation Fee</h4>
                    <p style={styles.detailInfoValue}>₹{appointment.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div style={styles.totalSection}>
              <div style={styles.totalContent}>
                <div>
                  <h3 style={styles.totalLeftTitle}>Total Amount</h3>
                  <p style={styles.totalLeftAmount}>₹{appointment.price}</p>
                </div>
                <div style={styles.totalIcon}>
                  <svg style={styles.totalIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button 
              onClick={handlePayment} 
              style={styles.paymentButton}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <svg style={styles.paymentButtonSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Pay Securely Now
            </button>

            {/* Security Notice */}
            <div style={styles.securityNotice}>
              <svg style={styles.securityNoticeSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Secured by Stripe • Your payment information is safe
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.paymentFooter}>
          <p style={styles.paymentFooterText}>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
