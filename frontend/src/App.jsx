import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicareIndex from "./components/MedicareIndex";
import TopDoctors from "./components/TopDoctors";
import Bookanappointment from "./components/Bookanappointment";
import Notifications from "./components/Notifications";
import Form from "./components/forms/form";
import LoginDoctor from "./components/forms/LoginDoctor";
import LoginPatient from "./components/forms/LoginPatient";
import User from "./components/forms/User";
import Doctor from "./components/forms/Doctor";
import Footer from "./components/forms/Footer";
import Header from "./components/forms/Header";

const Layout = ({ children }) => (<><Header />{children}<Footer /></>);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><MedicareIndex /></Layout>} />
        <Route path="/top-doctors" element={<Layout><TopDoctors /></Layout>} />
        <Route path="/book-appointment" element={<Layout><Bookanappointment /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/SignUp" element={<Layout><Form /></Layout>} />
        <Route path="/api/patient/login" element={<Layout><LoginPatient /></Layout>} />
        <Route path="/api/doctor/login" element={<Layout><LoginDoctor /></Layout>} />
        <Route path="/api/patient/register" element={<Layout><User /></Layout>} />
        <Route path="/api/doctor/register" element={<Layout><Doctor /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;