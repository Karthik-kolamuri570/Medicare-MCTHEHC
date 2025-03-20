import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from "./components/forms/Footer";
// import Header from "./components/forms/Header";
import MedicareIndex from "./components/MedicareIndex";
import TopDoctors from "./components/TopDoctors";
import Bookanappointment from "./components/Bookanappointment";
// import UserForm from "./components/UserForm";
import Notifications from "./components/Notifications";
import Form from "./components/forms/form";
import Login from "./components/forms/Login";
import User from "./components/forms/User";
import Doctor from "./components/forms/Doctor";

function App() {
  return (
    <Router>
      {/* <div>
      <Header />
      <div> */}
           <Routes>
        <Route path="/" element={<MedicareIndex />} />
        <Route path="/top-doctors" element={<TopDoctors />} />
        <Route path="/book-appointment" element={<Bookanappointment />} />
        {/* <Route path="/register" element={<UserForm />} /> */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/SignUp" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
      {/* </div>
      <Footer />
      </div> */}
    </Router>
  );
}

export default App;
