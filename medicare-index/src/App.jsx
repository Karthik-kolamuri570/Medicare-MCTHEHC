import Header from "./components/Header";
import Bookanappointment from "./components/Bookanappointment";
import Findahospital from "./components/Findahospital";
import Specialities from "./components/Specialities";
import FindaDoctor from "./components/FindaDoctor";
import Blogs from "./components/Blogs";
import TopDoctors from "./components/TopDoctors";
import Footer from "./components/Footer";
import "./App.css";

const blogData = [
  { img: "image1.jpg", title: "Blog 1", description: "This is the description for blog 1." },
  { img: "image2.jpg", title: "Blog 2", description: "This is the description for blog 2." },
  { img: "image3.jpg", title: "Blog 3", description: "This is the description for blog 3." },
  { img: "image4.jpg", title: "Blog 4", description: "This is the description for blog 4." },
];

const App = () => {
  return (
    <div>
      <Header />
      <Bookanappointment />
      <Findahospital />
      <Specialities />
      <FindaDoctor />
      <Blogs blogs={blogData} />
      <TopDoctors />
      <Footer />
    </div>
  );
};

export default App;
