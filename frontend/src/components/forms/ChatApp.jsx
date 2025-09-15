

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { StreamChat } from "stream-chat";
// import {
//   Chat,
//   Channel,
//   MessageList,
//   MessageInput,
// } from "stream-chat-react";
// import "stream-chat-react/dist/css/v2/index.css";
// import Loader from "../ui/Loader";

// const generateChannelId = (id1, id2) => [id1, id2].sort().join("-");

// const ChatApp = () => {
//   const { receiverId } = useParams();
//   const [chatClient, setChatClient] = useState(null);
//   const [activeChannel, setActiveChannel] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     const initChat = async () => {
//       try {
//         const res = await fetch("http://localhost:1600/api/stream/token", {
//           credentials: "include",
//         });
//         const { token, userId, apiKey } = await res.json();

//         if (!userId || !receiverId) {
//           console.error("❌ Missing userId or receiverId", { userId, receiverId });
//           return;
//         }

//         const [doctorId, patientId] = receiverId.split("-");
//         const peerId = userId === doctorId ? patientId : doctorId;

//         const client = StreamChat.getInstance(apiKey);
//         await client.connectUser({ id: userId }, token);

//         await axios.post(
//           "http://localhost:1600/api/stream/upsert-users",
//           { users: [{ id: userId }, { id: peerId }] },
//           { withCredentials: true }
//         );

//         const channelId = generateChannelId(userId, peerId);
//         const channel = client.channel("messaging", channelId, {
//           members: [userId, peerId],
//         });

//         await channel.watch();

//         if (mounted) {
//           setChatClient(client);
//           setActiveChannel(channel);
//         }
//       } catch (err) {
//         console.error("🚨 Stream setup error:", err);
//         toast.error("Failed to connect to the chat service.");
//       }
//     };

//     initChat();

//     return () => {
//       mounted = false;
//       if (chatClient) chatClient.disconnectUser();
//     };
//   }, [receiverId]);

//   if (!chatClient || !activeChannel) return <Loader />;

//   const handleVideoCall = () => {
//     if (!activeChannel) {
//       console.error("❌ No active channel to initiate a video call");
//       return;
//     }
//     const channelId = activeChannel.id;
//     const callUrl = `${window.location.origin}/api/video-call/${channelId}`;
//     activeChannel.sendMessage({
//       text: `📞 Video call started! Join here: ${callUrl}`,
//     });
//     toast.success("Video call link sent in chat!");
//   };

//   const memberCount = activeChannel.state?.members
//     ? Object.keys(activeChannel.state.members).length
//     : 0;
//   const onlineMembers = activeChannel.state?.members
//     ? Object.values(activeChannel.state.members).filter((m) => m.user.online).length
//     : 0;

//   return (
//     <>
//       {/* Override Stream CSS completely */}
//       <style>{`
//         body, html {
//           margin: 0 !important;
//           padding: 0 !important;
//           height: 100vh !important;
//           overflow: hidden !important;
//         }
//         .str-chat {
//           height: 100vh !important;
//           width: 100vw !important;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
//           position: fixed !important;
//           top: 0 !important;
//           left: 0 !important;
//         }
//         .str-chat-channel {
//           height: 100vh !important;
//           width: 100vw !important;
//           display: flex !important;
//           flex-direction: column !important;
//         }
//         .str-chat__container {
//           height: 100vh !important;
//           width: 100vw !important;
//           display: flex !important;
//           flex-direction: column !important;
//         }
//         .str-chat__list {
//           flex: 1 !important;
//           background: #e5ddd5 !important;
//           padding: 20px !important;
//           overflow-y: auto !important;
//           min-height: 0 !important;
//           padding-bottom: 80px !important;
//         }
//         .str-chat__message-simple__text {
//           background: #dcf8c6 !important;
//           color: #000 !important;
//           border-radius: 8px !important;
//           padding: 8px 12px !important;
//           box-shadow: 0 1px 0.5px rgba(0,0,0,0.13) !important;
//           max-width: 80% !important;
//         }
//         .str-chat__message-simple:not(.str-chat__message-simple--me) .str-chat__message-simple__text {
//           background: #ffffff !important;
//         }
//         .str-chat__input {
//           position: fixed !important;
//           bottom: 0 !important;
//           left: 0 !important;
//           right: 0 !important;
//           width: 100vw !important;
//           background: #f0f0f0 !important;
//           border-top: 1px solid #e0e0e0 !important;
//           padding: 15px 20px !important;
//           z-index: 1000 !important;
//           box-sizing: border-box !important;
//         }
//         .str-chat__input-flat {
//           background: white !important;
//           border: 1px solid #e0e0e0 !important;
//           border-radius: 25px !important;
//           padding: 12px 16px !important;
//           font-size: 14px !important;
//           width: 100% !important;
//           box-sizing: border-box !important;
//         }
//         .str-chat__input-flat:focus {
//           outline: none !important;
//           border-color: #25d366 !important;
//         }
//       `}</style>

//       <div style={{ 
//         height: "100vh", 
//         width: "100vw", 
//         display: "flex", 
//         flexDirection: "column",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         overflow: "hidden"
//       }}>
//         {/* WhatsApp Header - Fixed at top */}
//         <div
//           style={{
//             background: "#075e54",
//             color: "white",
//             padding: "12px 16px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             minHeight: "64px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 999,
//             width: "100vw",
//             boxSizing: "border-box",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%",
//                 background: "#25d366",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               }}
//             >
//               👤
//             </div>
//             <div>
//               <div style={{ fontWeight: "500", fontSize: "16px" }}>Doctor Chat</div>
//               <div style={{ fontSize: "13px", opacity: 0.8 }}>
//                 {onlineMembers > 0 ? "online" : "last seen recently"}
//               </div>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//             <button
//               onClick={handleVideoCall}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//                 fontSize: "20px",
//                 padding: "8px",
//                 borderRadius: "50%",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
//               onMouseLeave={(e) => (e.target.style.background = "none")}
//             >
//               📹
//             </button>
//           </div>
//         </div>

//         {/* Chat Container with proper spacing */}
//         <div style={{ 
//           marginTop: "76px", 
//           marginBottom: "70px", 
//           height: "calc(100vh - 146px)",
//           display: "flex", 
//           flexDirection: "column"
//         }}>
//           <Chat client={chatClient} theme="messaging light">
//             <Channel channel={activeChannel}>
//               <MessageList />
//               <MessageInput />
//             </Channel>
//           </Chat>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatApp;





































import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import Loader from "../ui/Loader";

const generateChannelId = (id1, id2) => [id1, id2].sort().join("-");

const ChatApp = () => {
  const { receiverId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'doctor' or 'patient'

  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      try {
        const res = await fetch("http://localhost:1600/api/stream/token", {
          credentials: "include",
        });
        const { token, userId, apiKey } = await res.json();

        if (!userId || !receiverId) {
          console.error("❌ Missing userId or receiverId", { userId, receiverId });
          return;
        }

        const [doctorId, patientId] = receiverId.split("-");
        const peerId = userId === doctorId ? patientId : doctorId;
        
        // Determine user role based on userId
        const role = userId === doctorId ? 'doctor' : 'patient';
        
        const client = StreamChat.getInstance(apiKey);
        await client.connectUser({ id: userId }, token);

        await axios.post(
          "http://localhost:1600/api/stream/upsert-users",
          { users: [{ id: userId }, { id: peerId }] },
          { withCredentials: true }
        );

        const channelId = generateChannelId(userId, peerId);
        const channel = client.channel("messaging", channelId, {
          members: [userId, peerId],
        });

        await channel.watch();

        if (mounted) {
          setChatClient(client);
          setActiveChannel(channel);
          setCurrentUser({ id: userId, role });
          setUserRole(role);
        }
      } catch (err) {
        console.error("🚨 Stream setup error:", err);
        toast.error("Failed to connect to the chat service.");
      }
    };

    initChat();

    return () => {
      mounted = false;
      if (chatClient) chatClient.disconnectUser();
    };
  }, [receiverId]);

  if (!chatClient || !activeChannel) return <Loader />;

  const handleVideoCall = () => {
    if (!activeChannel) {
      console.error("❌ No active channel to initiate a video call");
      return;
    }
    
    // Only doctors can start video calls
    if (userRole !== 'doctor') {
      toast.error("Only doctors can initiate video calls!");
      return;
    }

    const channelId = activeChannel.id;
    const callUrl = `${window.location.origin}/api/video-call/${channelId}`;
    activeChannel.sendMessage({
      text: `📞 Video call started by doctor! Join here: ${callUrl}`,
    });
    toast.success("Video call initiated!");
    
    // Redirect doctor to video call page
    window.open(callUrl, '_blank');
  };

  const memberCount = activeChannel.state?.members
    ? Object.keys(activeChannel.state.members).length
    : 0;
  const onlineMembers = activeChannel.state?.members
    ? Object.values(activeChannel.state.members).filter((m) => m.user.online).length
    : 0;

  return (
    <>
      {/* WhatsApp styling */}
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        .str-chat {
          height: 100vh !important;
          width: 100vw !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }
        .str-chat-channel {
          height: 100vh !important;
          width: 100vw !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .str-chat__container {
          height: 100vh !important;
          width: 100vw !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .str-chat__list {
          flex: 1 !important;
          background: #e5ddd5 !important;
          padding: 20px !important;
          overflow-y: auto !important;
          min-height: 0 !important;
          padding-bottom: 80px !important;
        }
        .str-chat__message-simple__text {
          background: #dcf8c6 !important;
          color: #000 !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13) !important;
          max-width: 80% !important;
        }
        .str-chat__message-simple:not(.str-chat__message-simple--me) .str-chat__message-simple__text {
          background: #ffffff !important;
        }
        .str-chat__input {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          background: #f0f0f0 !important;
          border-top: 1px solid #e0e0e0 !important;
          padding: 15px 20px !important;
          z-index: 1000 !important;
          box-sizing: border-box !important;
        }
        .str-chat__input-flat {
          background: white !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 25px !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .str-chat__input-flat:focus {
          outline: none !important;
          border-color: #25d366 !important;
        }
      `}</style>

      <div style={{ 
        height: "100vh", 
        width: "100vw", 
        display: "flex", 
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden"
      }}>
        {/* WhatsApp Header */}
        <div
          style={{
            background: "#075e54",
            color: "white",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            width: "100vw",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: userRole === 'doctor' ? "#25d366" : "#128c7e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {userRole === 'doctor' ? '👨‍⚕️' : '🤒'}
            </div>
            <div>
              <div style={{ fontWeight: "500", fontSize: "16px" }}>
                {userRole === 'doctor' ? 'Patient Chat' : 'Doctor Chat'}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>
                {onlineMembers > 0 ? "online" : "last seen recently"}
                <span style={{ marginLeft: "8px", fontSize: "12px", backgroundColor: userRole === 'doctor' ? '#128c7e' : '#25d366', padding: "2px 6px", borderRadius: "10px" }}>
                  {userRole === 'doctor' ? 'DOCTOR' : 'PATIENT'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Video Call Button - Only show for doctors */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {userRole === 'doctor' && (
              <button
                onClick={handleVideoCall}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "8px",
                  borderRadius: "50%",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
                title="Start Video Call (Doctor Only)"
              >
                📹
              </button>
            )}
            
            {userRole === 'patient' && (
              <div style={{ 
                fontSize: "12px", 
                opacity: 0.7, 
                fontStyle: "italic",
                textAlign: "right",
                lineHeight: "1.2"
              }}>
                Doctor can start<br/>video calls
              </div>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div style={{ 
          marginTop: "76px", 
          marginBottom: "70px", 
          height: "calc(100vh - 146px)",
          display: "flex", 
          flexDirection: "column"
        }}>
          <Chat client={chatClient} theme="messaging light">
            <Channel channel={activeChannel}>
              <MessageList />
              <MessageInput />
            </Channel>
          </Chat>
        </div>
      </div>
    </>
  );
};

export default ChatApp;
