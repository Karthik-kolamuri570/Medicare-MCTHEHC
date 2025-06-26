import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicareIndex from "./components/MedicareIndex";
import TopDoctors from "./components/TopDoctors";
import Bookanappointment from "./components/Bookanappointment";
import Notifications from "./components/Notifications";
import Form from "./components/forms/form";
import LoginDoctor from "./components/forms/LoginDoctor";
import LoginPatient from "./components/forms/LoginPatient";
import User from "./components/forms/User";
import Doctor from "./components/forms/DoctorRegister";
import Footer from "./components/forms/Footer";
import Header from "./components/forms/Header";
import DHeader from "./components/Doctor.forms/DHeader";
import DFooter from "./components/Doctor.forms/DFooter";
import DoctorDashboard from "./components/Doctor.forms/DoctorDashboard";
import DSecondOpinions from "./components/Doctor.forms/DSecondOpinions";
import DBlogs from "./components/Doctor.forms/DBlogs";
import DAppointments from "./components/Doctor.forms/DAppointments";
import DOnlineConsultation from "./components/Doctor.forms/DOnlineConsultation";
import LogoutPatient from "./components/forms/LogoutPatient";
import LogoutDoctor from "./components/Doctor.forms/LogoutDoctor";
import OnlineConsultation from './components/forms/OnlineConsultation'
// import ChatApp from "./components/forms/ChatApp";
import ChatWrapper from "./components/forms/ChatWrapper";
import CallPage from "./components/forms/CallPage";''
import {Toaster} from 'react-hot-toast';
const Layout = ({ children }) => (<><Header />{children}<Footer /></>);
const DLayout = ({ children }) => (<><DHeader />{children}<DFooter /></>);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><MedicareIndex /></Layout>} />
        <Route path="/top-doctors" element={<Layout><TopDoctors /></Layout>} />
        <Route path="/book-appointment" element={<Layout><Bookanappointment /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/SignUp" element={<Layout><Form /></Layout>} />
        <Route path="/api/patient/login" element={<Layout><LoginPatient /></Layout>} />
        <Route path="/api/doctor/login" element={<Layout><LoginDoctor /></Layout>} />
        <Route path="/api/patient/register" element={<Layout><User /></Layout>} />
        <Route path="/api/doctor/register" element={<Layout><Doctor /></Layout>} />
        <Route path="/api/patient/logout" element={<LogoutPatient/>} />
        <Route path="/api/patient/online-consultation" element={<Layout><OnlineConsultation /></Layout>} />
        {/* <Route path="/api/chat/:receiverId" element={<Layout><ChatWrapper /></Layout>} /> */}

        {/* Doctor Dashboard Routes */}
        <Route path="/api/doctor" element={<DLayout><DoctorDashboard /></DLayout>} />
        <Route path="/api/doctor/my-appointments" element={<DLayout><DAppointments /></DLayout>} />
        <Route path="/api/doctor/my-consultations" element={<DLayout><DOnlineConsultation /></DLayout>} />
        <Route path="/api/doctor/second-opinion" element={<DLayout><DSecondOpinions /></DLayout>} />
        <Route path="/my-blogs" element={<DLayout><DBlogs /></DLayout>} />
        <Route path="/api/doctor/logout" element={<LogoutDoctor/>} />
        {/* <Route path="/chat/:patientId" element={<DLayout><ChatApp /></DLayout>} /> */}
        <Route path="/api/chat/:receiverId" element={<ChatWrapper />} />
        <Route path="/api/video-call/:receiverId" element={<CallPage />} />

         
        {/* Protected Routes */}
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
