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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  CallControls,
  CallingState,
  useCallStateHooks,
  SpeakerLayout,
  StreamVideo,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import axios from "axios";
import toast from "react-hot-toast";

let globalVideoClient = null;

const CustomControls = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return null;
  return <CallControls />;
};

const CallPage = () => {
  const { receiverId } = useParams(); // Format: doctorId-patientId
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    let activeCall;

    const initCall = async () => {
      try {
        const res = await fetch("http://localhost:1600/api/stream/token", {
          credentials: "include",
        });

        const { token, userId, apiKey } = await res.json();

        if (!userId || !receiverId) {
          console.error("Missing userId or receiverId", { userId, receiverId });
          return;
        }

        const [doctorId, patientId] = receiverId.split("-");
        const peerId = userId === doctorId ? patientId : doctorId;

        await axios.post(
          "http://localhost:1600/api/stream/upsert-users",
          {
            users: [{ id: userId }, { id: peerId }],
          },
          { withCredentials: true }
        );

        if (!globalVideoClient) {
          globalVideoClient = new StreamVideoClient({
            apiKey,
            user: { id: userId },
            token,
          });
        }

        const callId = [userId, peerId].sort().join("-");
        activeCall = globalVideoClient.call("default", callId);

        const callInfo = await activeCall.get();
        if (callInfo && callInfo.members?.some(m => m.user_id === userId)) {
          console.log("Already joined, skipping re-join.");
        } else {
          await activeCall.getOrCreate();
          await activeCall.join();
        }

        setVideoClient(globalVideoClient);
        setCall(activeCall);
      } catch (err) {
        console.error("Error setting up video call:", err);
        toast.error("❌ Failed to join video call.");
      }
    };

    initCall();

    return () => {
      if (activeCall) {
        try {
          activeCall.leave(); // gracefully exit the call on unmount
        } catch (err) {
          console.warn("Error while leaving call:", err.message);
        }
      }
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
