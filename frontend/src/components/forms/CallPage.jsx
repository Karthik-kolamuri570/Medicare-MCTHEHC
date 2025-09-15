



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
import Loader from "../ui/Loader"

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

        //  Step 2: Parse peerId
        const [doctorId, patientId] = receiverId.split("-");
        const peerId = userId === doctorId ? patientId : doctorId;

        //  Step 3: Sync users with Stream
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

        //  Step 5: Create/join call
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

    return () => {
      if (activeCall && activeCall.state.callingState !== CallingState.LEFT) {
        activeCall.leave().catch((err) =>
          console.warn("⚠️ Error during cleanup leave:", err.message)
        );
      }
      hasJoinedRef.current = false;
    };
  }, [receiverId]);

  if (!call) return <Loader />;

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







































// only user caan able to cut the call and doctor doesnot have an access to cut the call



// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   StreamVideoClient,
//   StreamCall,
//   StreamTheme,
//   CallingState,
//   useCallStateHooks,
//   SpeakerLayout,
//   StreamVideo,
//   useCall,
// } from "@stream-io/video-react-sdk";
// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Loader from "../ui/Loader";

// // Singleton video client
// let globalVideoClient = null;

// // ✅ Custom CallControls with ALL features using hooks
// const CustomControls = () => {
//   const { useCallCallingState, useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();
//   const callingState = useCallCallingState();
//   const call = useCall();
//   const navigate = useNavigate();
//   const { receiverId } = useParams();
//   const [userRole, setUserRole] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);

//   // Get microphone, camera, and screen share states
//   const { microphone, isMute } = useMicrophoneState();
//   const { camera, isMute: isCameraMute } = useCameraState();
//   const { screenShare, isScreenShareOn } = useScreenShareState();

//   // Determine user role
//   useEffect(() => {
//     const getUserRole = async () => {
//       try {
//         const res = await fetch("http://localhost:1600/api/stream/token", {
//           credentials: "include",
//         });
//         const { userId } = await res.json();
        
//         if (userId && receiverId) {
//           const [doctorId, patientId] = receiverId.split("-");
//           const role = userId === doctorId ? 'doctor' : 'patient';
//           setUserRole(role);
//         }
//       } catch (err) {
//         console.error("Error getting user role:", err);
//       }
//     };
    
//     getUserRole();
//   }, [receiverId]);

//   const handleEndCall = async () => {
//     // STRICT: Only patients can end calls
//     if (userRole !== 'patient') {
//       toast.error("❌ Only patients are authorized to end the video call!");
//       return;
//     }
    
//     try {
//       if (call && call.state.callingState !== CallingState.LEFT) {
//         await call.leave();
//       }
//       toast.success("📞 Call ended by patient");
//     } catch (err) {
//       console.warn("⚠️ Leave failed:", err.message);
//     } finally {
//       navigate("/");
//     }
//   };

//   const toggleMicrophone = async () => {
//     try {
//       if (isMute) {
//         await microphone.enable();
//         toast.success("🎤 Microphone unmuted");
//       } else {
//         await microphone.disable();
//         toast.success("🔇 Microphone muted");
//       }
//     } catch (err) {
//       toast.error("Failed to toggle microphone");
//     }
//   };

//   const toggleCamera = async () => {
//     try {
//       if (isCameraMute) {
//         await camera.enable();
//         toast.success("📹 Camera turned on");
//       } else {
//         await camera.disable();
//         toast.success("📹 Camera turned off");
//       }
//     } catch (err) {
//       toast.error("Failed to toggle camera");
//     }
//   };

//   const toggleScreenShare = async () => {
//     try {
//       if (isScreenShareOn) {
//         await screenShare.disable();
//         toast.success("🖥️ Screen sharing stopped");
//       } else {
//         await screenShare.enable();
//         toast.success("🖥️ Screen sharing started");
//       }
//     } catch (err) {
//       toast.error("Failed to toggle screen share");
//     }
//   };

//   const handleStartRecording = async () => {
//     try {
//       await call.startRecording();
//       setIsRecording(true);
//       toast.success("🔴 Recording started");
//     } catch (err) {
//       toast.error("Failed to start recording");
//     }
//   };

//   const handleStopRecording = async () => {
//     try {
//       await call.stopRecording();
//       setIsRecording(false);
//       toast.success("⏹️ Recording stopped");
//     } catch (err) {
//       toast.error("Failed to stop recording");
//     }
//   };

//   if (callingState !== CallingState.JOINED) return null;

//   return (
//     <>
//       {/* Top Status Bar */}
//       <div style={{
//         position: 'absolute',
//         top: '20px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         background: 'rgba(0, 0, 0, 0.8)',
//         color: 'white',
//         padding: '10px 20px',
//         borderRadius: '25px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '15px',
//         zIndex: 1001,
//         fontSize: '14px',
//         fontWeight: 'bold'
//       }}>
//         <div style={{
//           background: userRole === 'doctor' ? '#075e54' : '#25d366',
//           padding: '5px 12px',
//           borderRadius: '15px',
//           fontSize: '12px'
//         }}>
//           {userRole === 'doctor' ? '👨‍⚕️ DOCTOR' : '🤒 PATIENT'}
//         </div>
        
//         {isRecording && (
//           <div style={{
//             background: '#dc3545',
//             padding: '5px 12px',
//             borderRadius: '15px',
//             fontSize: '12px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '5px'
//           }}>
//             🔴 RECORDING
//           </div>
//         )}
        
//         <div>Video Call Session</div>
//       </div>

//       {/* Main Control Panel */}
//       <div style={{
//         position: 'absolute',
//         bottom: '20px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         background: 'rgba(0, 0, 0, 0.9)',
//         padding: '20px',
//         borderRadius: '25px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '15px',
//         zIndex: 1000,
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//       }}>
//         {/* Audio Control */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={toggleMicrophone}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: isMute ? '#dc3545' : '#28a745',
//               color: 'white',
//               fontSize: '20px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             {isMute ? '🔇' : '🎤'}
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             {isMute ? 'Unmute' : 'Mute'}
//           </span>
//         </div>

//         {/* Video Control */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={toggleCamera}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: isCameraMute ? '#dc3545' : '#28a745',
//               color: 'white',
//               fontSize: '20px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             {isCameraMute ? '📹' : '📸'}
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             {isCameraMute ? 'Turn On' : 'Turn Off'}
//           </span>
//         </div>

//         {/* Screen Share */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={toggleScreenShare}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: isScreenShareOn ? '#007bff' : '#6c757d',
//               color: 'white',
//               fontSize: '18px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             🖥️
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             {isScreenShareOn ? 'Stop Share' : 'Share Screen'}
//           </span>
//         </div>

//         {/* Recording Control */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: isRecording ? '#dc3545' : '#6c757d',
//               color: 'white',
//               fontSize: '18px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             {isRecording ? '⏹️' : '🔴'}
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             {isRecording ? 'Stop Rec' : 'Record'}
//           </span>
//         </div>

//         {/* Reactions */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => {
//               toast.success("👍 Reaction sent!");
//             }}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: '#ffc107',
//               color: 'white',
//               fontSize: '18px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             👍
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             Reactions
//           </span>
//         </div>

//         {/* Chat Toggle */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => {
//               toast.info("💬 Chat feature coming soon!");
//             }}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: '#17a2b8',
//               color: 'white',
//               fontSize: '18px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             💬
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             Chat
//           </span>
//         </div>

//         {/* Settings */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => {
//               toast.info("⚙️ Settings panel coming soon!");
//             }}
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               border: 'none',
//               background: '#6c757d',
//               color: 'white',
//               fontSize: '18px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.transform = 'scale(1.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'scale(1)';
//             }}
//           >
//             ⚙️
//           </button>
//           <span style={{
//             position: 'absolute',
//             bottom: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             fontSize: '10px',
//             color: 'white',
//             whiteSpace: 'nowrap'
//           }}>
//             Settings
//           </span>
//         </div>

//         {/* SEPARATOR */}
//         <div style={{
//           width: '2px',
//           height: '40px',
//           background: 'rgba(255, 255, 255, 0.3)',
//           margin: '0 10px'
//         }} />

//         {/* END CALL - PATIENT ONLY */}
//         {userRole === 'patient' ? (
//           <div style={{ position: 'relative' }}>
//             <button
//               onClick={handleEndCall}
//               style={{
//                 width: '60px',
//                 height: '60px',
//                 borderRadius: '50%',
//                 border: 'none',
//                 background: '#dc3545',
//                 color: 'white',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 transition: 'all 0.2s ease',
//                 boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = '#c82333';
//                 e.target.style.transform = 'scale(1.1)';
//                 e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.6)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = '#dc3545';
//                 e.target.style.transform = 'scale(1)';
//                 e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
//               }}
//             >
//               📞
//             </button>
//             <span style={{
//               position: 'absolute',
//               bottom: '-25px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               fontSize: '10px',
//               color: 'white',
//               fontWeight: 'bold',
//               whiteSpace: 'nowrap'
//             }}>
//               End Call
//             </span>
//           </div>
//         ) : (
//           <div style={{ 
//             textAlign: 'center',
//             color: 'rgba(255, 255, 255, 0.6)',
//             fontSize: '12px',
//             fontStyle: 'italic',
//             padding: '0 15px',
//             lineHeight: '1.3'
//           }}>
//             🚫 Only patient can<br />end this call
//           </div>
//         )}
//       </div>

//       {/* Doctor Additional Notice */}
//       {userRole === 'doctor' && (
//         <div style={{
//           position: 'absolute',
//           top: '80px',
//           right: '20px',
//           background: 'rgba(7, 94, 84, 0.9)',
//           color: 'white',
//           padding: '15px 20px',
//           borderRadius: '15px',
//           fontSize: '13px',
//           maxWidth: '250px',
//           zIndex: 999,
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
//         }}>
//           <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
//             👨‍⚕️ Doctor Guidelines:
//           </div>
//           <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.4' }}>
//             <li>Use all call features freely</li>
//             <li>Patient controls call duration</li>
//             <li>Recording available for both</li>
//             <li>Share screen for diagnosis</li>
//           </ul>
//         </div>
//       )}
//     </>
//   );
// };

// const CallPage = () => {
//   const { receiverId } = useParams();
//   const [videoClient, setVideoClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const hasJoinedRef = useRef(false);

//   useEffect(() => {
//     let activeCall;

//     const initCall = async () => {
//       if (hasJoinedRef.current) return;
//       hasJoinedRef.current = true;

//       try {
//         const res = await fetch("http://localhost:1600/api/stream/token", {
//           credentials: "include",
//         });

//         const { token, userId, apiKey } = await res.json();

//         if (!userId || !receiverId) {
//           console.error("Missing userId or receiverId", { userId, receiverId });
//           return;
//         }

//         const [doctorId, patientId] = receiverId.split("-");
//         const peerId = userId === doctorId ? patientId : doctorId;
//         const userRole = userId === doctorId ? 'doctor' : 'patient';

//         await axios.post(
//           "http://localhost:1600/api/stream/upsert-users",
//           {
//             users: [{ id: userId }, { id: peerId }],
//           },
//           { withCredentials: true }
//         );

//         if (!globalVideoClient) {
//           globalVideoClient = new StreamVideoClient({
//             apiKey,
//             user: { id: userId },
//             token,
//           });
//         }

//         const callId = [userId, peerId].sort().join("-");
//         activeCall = globalVideoClient.call("default", callId);

//         await activeCall.getOrCreate();
//         await activeCall.join();

//         setVideoClient(globalVideoClient);
//         setCall(activeCall);
        
//         if (userRole === 'doctor') {
//           toast.success("👨‍⚕️ Doctor joined - Patient controls call duration", {
//             duration: 4000
//           });
//         } else {
//           toast.success("🤒 Patient joined - You can end the call anytime", {
//             duration: 4000
//           });
//         }
        
//       } catch (err) {
//         console.error("❌ Error setting up video call:", err);
//         toast.error("❌ Failed to join video call.");
//       }
//     };

//     initCall();

//     return () => {
//       if (activeCall && activeCall.state.callingState !== CallingState.LEFT) {
//         activeCall.leave().catch((err) =>
//           console.warn("⚠️ Error during cleanup leave:", err.message)
//         );
//       }
//       hasJoinedRef.current = false;
//     };
//   }, [receiverId]);

//   if (!call) return <Loader />;

//   return (
//     <div style={{ 
//       height: '100vh', 
//       width: '100vw', 
//       position: 'relative', 
//       background: '#000',
//       overflow: 'hidden'
//     }}>
//       <StreamVideo client={videoClient}>
//         <StreamCall call={call}>
//           <StreamTheme>
//             <SpeakerLayout />
//             <CustomControls />
//           </StreamTheme>
//         </StreamCall>
//       </StreamVideo>
//     </div>
//   );
// };

// export default CallPage;
