import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatApp from "./ChatApp"; // your Stream chat component

const ChatWrapper = () => {
  const { patientId } = useParams();
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    // Fetch the doctor ID via JWT auth
    const token = localStorage.getItem("token");
    fetch("/api/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          setDoctorId(data.userId);
        }
      })
      .catch((err) => console.error("Error fetching doctor:", err));
  }, []);

  if (!doctorId) return <p>Loading ... info...</p>;

  return <ChatApp doctorId={doctorId} patientId={patientId} />;
};

export default ChatWrapper;
