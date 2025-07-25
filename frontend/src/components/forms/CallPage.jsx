// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   StreamVideoClient,
//   StreamCall,
//   StreamTheme,
//   CallControls,
//   CallingState,
//   useCallStateHooks,
//   SpeakerLayout,
//   StreamVideo,
// } from "@stream-io/video-react-sdk";
// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import axios from "axios";
// import toast from "react-hot-toast";

// // ⛑️ Manual singleton instance
// let globalVideoClient = null;

// const CustomControls = () => {
//   const { useCallCallingState } = useCallStateHooks();
//   const callingState = useCallCallingState();

//   if (callingState !== CallingState.JOINED) return null;

//   return <CallControls />;
// };

// const CallPage = () => {
//   const { receiverId } = useParams(); // doctorId-patientId
//   const [videoClient, setVideoClient] = useState(null);
//   const [call, setCall] = useState(null);

//   useEffect(() => {
//     const initCall = async () => {
//       try {
//         const res = await fetch("http://localhost:1600/api/stream/token", {
//           credentials: "include",
//         });

//         const { token, userId, apiKey } = await res.json();

//         if (!userId || !receiverId) {
//           console.error("Missing userId or receiverId", { userId, receiverId });
//           return;
//         }
//         console.log("User ID:", userId, "Receiver ID:", receiverId, "Peer ID:", peerId, apiKey, token);

//         const [doctorId, patientId] = receiverId.split("-");
//         const peerId = userId === doctorId ? patientId : doctorId;

//         // Upsert users to Stream backend
//         await axios.post(
//           "http://localhost:1600/api/stream/upsert-users",
//           {
//             users: [
//               { id: userId },
//               { id: peerId },
//             ],
//           },
//           { withCredentials: true }
//         );
//         toast.success("✅ Users synced with Stream backend");
//         // ✅ Use global instance if it exists
//         if (!globalVideoClient) {
//           globalVideoClient = new StreamVideoClient({
//             apiKey,
//             user: { id: userId },
//             token,
//           });
//         }

//         const callId = [userId, peerId].sort().join("-");
//         const call = globalVideoClient.call("default", callId);

//         await call.getOrCreate();
//         await call.join(); // 🚀 Actually joins the call

//         setVideoClient(globalVideoClient);
//         setCall(call);
//       } catch (err) {
//         console.error("Error setting up video call:", err);
//         toast.error("❌ Failed to join video call.");
//       }
//     };

//     initCall();

//     return () => {
//       // Optional cleanup (only if you're confident you want to disconnect)
//       // globalVideoClient?.disconnectUser();
//     };
//   }, [receiverId]);

//   if (!call) return <p> Loading video call...</p>;

//   return (
//     <StreamVideo client={videoClient}>
//       <StreamCall call={call}>
//         <StreamTheme>
//           <SpeakerLayout />
//           <CustomControls />
//         </StreamTheme>
//       </StreamCall>
//     </StreamVideo>
//   );
// };

// export default CallPage;



import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  CallControls,
  CallingState,
  useCallStateHooks,
  SpeakerLayout,
  StreamVideo,
  useCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import axios from "axios";
import toast from "react-hot-toast";

// Singleton video client
let globalVideoClient = null;

// ✅ Custom CallControls with leave handling + redirect
const CustomControls = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const navigate = useNavigate();

  const handleLeave = async () => {
    try {
      // ✅ Prevent double leave errors
      if (call && call.state.callingState !== CallingState.LEFT) {
        await call.leave();
      }
      toast.success("📞 Call ended");
    } catch (err) {
      console.warn("⚠️ Leave failed:", err.message);
    } finally {
      navigate("/"); // ✅ Always redirect
    }
  };

  if (callingState !== CallingState.JOINED) return null;

  return <CallControls onLeave={handleLeave} />;
};

const CallPage = () => {
  const { receiverId } = useParams(); // Format: doctorId-patientId
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const hasJoinedRef = useRef(false); // Prevents duplicate joins

  useEffect(() => {
    let activeCall;

    const initCall = async () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      try {
        // 🔑 Step 1: Get token & user info
        const res = await fetch("http://localhost:1600/api/stream/token", {
          credentials: "include",
        });

        const { token, userId, apiKey } = await res.json();

        if (!userId || !receiverId) {
          console.error("Missing userId or receiverId", { userId, receiverId });
          return;
        }

        // 👥 Step 2: Parse peerId
        const [doctorId, patientId] = receiverId.split("-");
        const peerId = userId === doctorId ? patientId : doctorId;

        // 🧠 Step 3: Sync users with Stream
        await axios.post(
          "http://localhost:1600/api/stream/upsert-users",
          {
            users: [{ id: userId }, { id: peerId }],
          },
          { withCredentials: true }
        );

        // ⚙️ Step 4: Create or reuse singleton client
        if (!globalVideoClient) {
          globalVideoClient = new StreamVideoClient({
            apiKey,
            user: { id: userId },
            token,
          });
        }

        // 📞 Step 5: Create/join call
        const callId = [userId, peerId].sort().join("-");
        activeCall = globalVideoClient.call("default", callId);

        await activeCall.getOrCreate();
        await activeCall.join();

        setVideoClient(globalVideoClient);
        setCall(activeCall);
      } catch (err) {
        console.error("❌ Error setting up video call:", err);
        toast.error("❌ Failed to join video call.");
      }
    };

    initCall();

    // 🧹 Cleanup on unmount
    return () => {
      if (activeCall && activeCall.state.callingState !== CallingState.LEFT) {
        activeCall.leave().catch((err) =>
          console.warn("⚠️ Error during cleanup leave:", err.message)
        );
      }
      hasJoinedRef.current = false;
    };
  }, [receiverId]);

  if (!call) return <p>Loading video call...</p>;

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <StreamTheme>
          <SpeakerLayout />
          <CustomControls />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallPage;
