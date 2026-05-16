import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MedicareIndex from "./components/MedicareIndex";
import TopDoctors from "./components/TopDoctors";
import Bookanappointment from "./components/Bookanappointment";
import Notifications from "./components/Notifications";
import UnifiedRegister from "./components/forms/UnifiedRegister";
import UnifiedLogin from "./components/forms/UnifiedLogin";
import Footer from "./components/forms/Footer";
import Header from "./components/forms/Header";
import DHeader from "./components/Doctor.forms/DHeader";
import DFooter from "./components/Doctor.forms/DFooter";
import DoctorDashboard from "./components/Doctor.forms/DoctorDashboard";
import DSecondOpinions from "./components/Doctor.forms/DSecondOpinions";
import DBlogs from "./components/Doctor.forms/DBlogs";
import DAppointments from "./components/Doctor.forms/DAppointments";
import DOnlineConsultation from "./components/Doctor.forms/DOnlineConsultation";
import DNotifications from "./components/Doctor.forms/DNotifications";
import DAnalytics from "./components/Doctor.forms/DAnalytics";
import PrescriptionForm from "./components/Doctor.forms/PrescriptionForm";
import MyPrescriptions from "./components/Patient.forms/MyPrescriptions";
import LogoutPatient from "./components/forms/LogoutPatient";
import LogoutDoctor from "./components/Doctor.forms/LogoutDoctor";
import OnlineConsultation from './components/forms/OnlineConsultation'
// import ChatApp from "./components/forms/ChatApp";
import ChatWrapper from "./components/forms/ChatWrapper";
import CallPage from "./components/forms/CallPage";
import { Toaster } from 'react-hot-toast';
import PaymentSuccess from './payments/PaymentSuccess';
import PaymentCancel from './payments/PaymentCancel';
import GetSecondOpinion from "./components/forms/GetSecondOpinion";
import ForgotPassword from "./components/forms/ForgotPassword";
import ResetPassword from "./components/forms/ResetPassword";
import BankHome from "./components/BloodBanks/BankHome";
import BloodBankContainer from './components/BloodBanks/BloodBankContainer';
import UserPortal from './components/BloodBanks/UserPortal'
import BloodCampAdmin from './components/BloodBanks/BloodCampAdmin';
import BlogListPage from "./components/Blogs/pages/BlogListPage"
import BlogDetailsPage from "./components/Blogs/pages/BlogDetailsPage";
import DoctorDashboardPage from "./components/Blogs/pages/DoctorDashboardPage";
import PatientLikesPage from "./components/Blogs/pages/PatientLikesPage";
import Treatments from "./components/Treatments";
import ProtectedPatientRoute from "./components/ProtectedPatientRoute";
import ProtectedDoctorRoute from "./components/ProtectedDoctorRoute";
import OurHospitals from "./components/OurHospitals";
import DoctorProfile from "./components/DoctorProfile";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Doctors from "./admin/pages/Doctors";
import Appointments from "./admin/pages/Appointments";
import Payments from "./admin/pages/Payments";
import BlogModeration from "./admin/pages/BlogModeration";
import FlameBankAdmin from "./admin/pages/FlameBankAdmin";
import BloodCamps from "./admin/pages/BloodCamps";
import Settings from "./admin/pages/Settings";
import ANotifications from "./admin/pages/Notifications";

const Layout = ({ children }) => (<><Header />{children}<Footer /></>);
const DLayout = ({ children }) => (
  <>
    <DHeader />
    <div style={{ paddingTop: '80px' }}>{children}</div>
    <DFooter />
  </>
);

// Configure axios global interceptor for token expiry
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if it's an admin API call
      const isAdminApi = error.config.url.includes('/api/admin');
      if (isAdminApi) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Redirect to admin login if not already there
        if (!window.location.search.includes('role=admin')) {
          window.location.href = '/login?role=admin';
        }
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><MedicareIndex /></Layout>} />
        {/* ... existing routes ... */}

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
        <Route path="/admin/doctors" element={<ProtectedAdminRoute><Doctors /></ProtectedAdminRoute>} />
        <Route path="/admin/appointments" element={<ProtectedAdminRoute><Appointments /></ProtectedAdminRoute>} />
        <Route path="/admin/payments" element={<ProtectedAdminRoute><Payments /></ProtectedAdminRoute>} />
        <Route path="/admin/blogs" element={<ProtectedAdminRoute><BlogModeration /></ProtectedAdminRoute>} />
        <Route path="/admin/blood-camps" element={<ProtectedAdminRoute><BloodCamps /></ProtectedAdminRoute>} />
        <Route path="/admin/blood-banks" element={<ProtectedAdminRoute><FlameBankAdmin /></ProtectedAdminRoute>} />
        <Route path="/admin/settings" element={<ProtectedAdminRoute><Settings /></ProtectedAdminRoute>} />
        <Route path="/admin/notifications" element={<ProtectedAdminRoute><ANotifications /></ProtectedAdminRoute>} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />



        <Route path="/top-doctors" element={<Layout><TopDoctors /></Layout>} />
        <Route path="/top-doctors/:doctorId" element={<Layout><DoctorProfile /></Layout>} />
        <Route path="/treatments" element={<Layout><Treatments /></Layout>} />
        <Route path="/hospitals" element={<Layout><OurHospitals /></Layout>} />
        <Route path="/book-appointment/:doctorId" element={<ProtectedPatientRoute><Layout><Bookanappointment /></Layout></ProtectedPatientRoute>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/SignUp" element={<Layout><UnifiedRegister /></Layout>} />
        <Route path="/login" element={<Layout><UnifiedLogin /></Layout>} />
        <Route path="/patient/register" element={<Navigate to="/SignUp?role=patient" replace />} />
        <Route path="/doctor/register" element={<Navigate to="/SignUp?role=doctor" replace />} />
        <Route path="/forgot-password/:role" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/reset-password/:role" element={<Layout><ResetPassword /></Layout>} />
        <Route path="/patient/logout" element={<LogoutPatient />} />
        <Route path="/patient/online-consultation" element={<ProtectedPatientRoute><Layout><OnlineConsultation /></Layout></ProtectedPatientRoute>} />
        <Route path="/get-second-opinion" element={<ProtectedPatientRoute><Layout><GetSecondOpinion /></Layout></ProtectedPatientRoute>} />
        <Route path="/blood-bank" element={<BankHome />} />
        <Route path="/blood-bank/bank" element={<BloodBankContainer />} />
        <Route path="/blood-bank/user" element={<UserPortal />} />
        <Route path="/doctor/blood-camp/admin" element={<BloodCampAdmin />} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<Layout><BlogListPage /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogDetailsPage /></Layout>} />
        <Route path="/doctor/doc/blogs" element={<DLayout><DoctorDashboardPage /></DLayout>} />
        <Route path="/patient/likes" element={<Layout><PatientLikesPage /></Layout>} />

        {/* Doctor Dashboard Routes — Protected */}
        <Route path="/doctor" element={<ProtectedDoctorRoute><DLayout><DoctorDashboard /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/my-appointments" element={<ProtectedDoctorRoute><DLayout><DAppointments /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/my-consultations" element={<ProtectedDoctorRoute><DLayout><DOnlineConsultation /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/second-opinion" element={<ProtectedDoctorRoute><DLayout><DSecondOpinions /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/my-blogs" element={<ProtectedDoctorRoute><DLayout><DBlogs /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/notifications" element={<ProtectedDoctorRoute><DLayout><DNotifications /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/analytics" element={<ProtectedDoctorRoute><DLayout><DAnalytics /></DLayout></ProtectedDoctorRoute>} />
        <Route path="/doctor/logout" element={<LogoutDoctor />} />

        {/* Patient Prescription Routes */}
        <Route path="/patient/prescriptions" element={<ProtectedPatientRoute><Layout><MyPrescriptions /></Layout></ProtectedPatientRoute>} />
        <Route path="/chat/:receiverId" element={<ChatWrapper />} />
        <Route path="/video-call/:receiverId" element={<CallPage />} />

        <Route path="/payment/success" element={<Layout><PaymentSuccess /></Layout>} />
        <Route path="/payment/cancel" element={<Layout><PaymentCancel /></Layout>} />

      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
