import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatApp from "./ChatApp";

const ChatWrapper = () => {
  // `receiverId` could be a doctor or patient id depending on who started the chat.
  // The route is actually `/chat/:patientId` or similar based on existing App.jsx setup, 
  // but let's just grab the parameter.
  const params = useParams();
  const receiverId = params.patientId || Object.values(params)[0];

  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Decode token payload to find role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || (payload.email ? 'patient' : 'doctor'); // Fallback logic
        const endpoint = role === 'doctor' ? '/api/doctor/me' : '/api/patient/me';

        const res = await fetch(endpoint, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        const data = await res.json();
        
        if (data.success && data.data) {
          setCurrentUserInfo({
            id: data.data.id || data.data._id,
            role: role
          });
        } else {
            console.error("Failed to fetch user data:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading chat info...</p>;
  if (!currentUserInfo) return <p>Unauthorized. Please log in.</p>;

  // Depending on whether current user is doctor or patient, 
  // assign patientId and doctorId for the chat.
  const isDoctor = currentUserInfo.role === 'doctor';
  const chatDoctorId = isDoctor ? currentUserInfo.id : receiverId;
  const chatPatientId = isDoctor ? receiverId : currentUserInfo.id;

  if (!chatDoctorId || !chatPatientId) {
      return <p>Missing participant IDs. Cannot start chat.</p>;
  }

  return <ChatApp doctorId={chatDoctorId} patientId={chatPatientId} />;
};

export default ChatWrapper;
