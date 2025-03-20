import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicareIndex from './components/MedicareIndex'
import TopDoctors from "./components/TopDoctors";
import Bookanappointment from "./components/Bookanappointment";
// import UserForm from "./components/UserForm";
import Notifications from "./components/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MedicareIndex />} />
        <Route path="/top-doctors" element={<TopDoctors />} />
        <Route path="/book-appointment" element={<Bookanappointment />} />
        {/* <Route path="/register" element={<UserForm />} /> */}
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}
export default App
