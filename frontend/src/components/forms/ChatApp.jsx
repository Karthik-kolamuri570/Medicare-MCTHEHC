import { StreamChat } from 'stream-chat';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  ChannelHeader,
  Window,
  LoadingIndicator
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const generateChannelId = (id1, id2) => [id1, id2].sort().join('-');

const ChatApp = () => {
  const { receiverId } = useParams(); // expects receiverId (doctorId-patientId)
  const [chatClient, setChatClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await fetch('http://localhost:1600/api/stream/token', {
          credentials: 'include'
        });

        const { token, userId, apiKey } = await res.json();

        if (!userId || !receiverId) {
          console.error("❌ Missing userId or receiverId", { userId, receiverId });
          return;
        }

        const [doctorId, patientId] = receiverId.split('-');
        const peerId = userId === doctorId ? patientId : doctorId;

        const client = StreamChat.getInstance(apiKey);
        await client.connectUser({ id: userId }, token);

        await axios.post(
          'http://localhost:1600/api/stream/upsert-users',
          {
            users: [
              { id: userId },
              { id: peerId }
            ]
          },
          { withCredentials: true }
        );

        const channelId = generateChannelId(userId, peerId);

        const channel = client.channel('messaging', channelId, {
          members: [userId, peerId]
        });

        await channel.watch();

        setChatClient(client);
        setActiveChannel(channel);
      } catch (err) {
        console.error('🚨 Stream setup error:', err);
      }
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [receiverId]);

  if (!chatClient || !activeChannel) return <LoadingIndicator />;

  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={activeChannel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatApp;



// import { StreamChat } from 'stream-chat';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Chat,
//   Channel,
//   MessageList,
//   MessageInput,
//   ChannelHeader,
//   Window,
//   LoadingIndicator
// } from 'stream-chat-react';
// import 'stream-chat-react/dist/css/v2/index.css';

// import {
//   StreamVideo,
//   StreamVideoClient,
//   CallingState,
//   CallControls,
//   StreamCall,
//   SpeakerLayout
// } from '@stream-io/video-react-sdk';
// import '@stream-io/video-react-sdk/dist/css/styles.css';

// const generateChannelId = (id1, id2) => [id1, id2].sort().join('-');

// const ChatApp = () => {
//   const { receiverId } = useParams(); // expects doctorId-patientId format
//   const [chatClient, setChatClient] = useState(null);
//   const [activeChannel, setActiveChannel] = useState(null);

//   const [videoClient, setVideoClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const [showVideo, setShowVideo] = useState(false); // toggle UI

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const res = await fetch('http://localhost:1600/api/stream/token', {
//           credentials: 'include',
//         });

//         const { token, userId, apiKey } = await res.json();

//         if (!userId || !receiverId) {
//           console.error('❌ Missing userId or receiverId', { userId, receiverId });
//           return;
//         }

//         const [doctorId, patientId] = receiverId.split('-');
//         const peerId = userId === doctorId ? patientId : doctorId;
//         const channelId = generateChannelId(userId, peerId);

//         // Init Stream Chat
//         const chat = StreamChat.getInstance(apiKey);
//         await chat.connectUser({ id: userId }, token);
//         await axios.post(
//           'http://localhost:1600/api/stream/upsert-users',
//           {
//             users: [
//               { id: userId },
//               { id: peerId }
//             ]
//           },
//           { withCredentials: true }
//         );
//         const channel = chat.channel('messaging', channelId, {
//           members: [userId, peerId]
//         });
//         await channel.watch();
//         setChatClient(chat);
//         setActiveChannel(channel);

//         // Init Stream Video
//         const video = new StreamVideoClient({ apiKey, user: { id: userId }, token });
//         const streamCall = video.call('default', channelId);

//         // This fixes the "can't find call" error
//         await streamCall.getOrCreate();
//         await streamCall.join();

//         setVideoClient(video);
//         setCall(streamCall);
//       } catch (err) {
//         console.error('🚨 Stream setup error:', err);
//       }
//     };

//     initChat();

//     return () => {
//       if (chatClient) chatClient.disconnectUser();
//       if (videoClient) videoClient.disconnectUser();
//     };
//   }, [receiverId]);

//   if (!chatClient || !activeChannel) return <LoadingIndicator />;

//   return (
//     <>
//       <Chat client={chatClient} theme="messaging light">
//         <Channel channel={activeChannel}>
//           <Window>
//             <ChannelHeader />
//             <MessageList />
//             <MessageInput />
//             <div style={{ marginTop: '10px' }}>
//               <button
//                 onClick={() => setShowVideo((prev) => !prev)}
//                 style={{
//                   padding: '10px 20px',
//                   background: '#007bff',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   marginTop: '12px',
//                 }}
//               >
//                 {showVideo ? 'Close Video Call' : 'Start Video Call'}
//               </button>
//             </div>
//           </Window>
//         </Channel>
//       </Chat>

//       {videoClient && call && showVideo && (
//         <StreamVideo client={videoClient}>
//           <StreamCall call={call}>
//             <div style={{ height: '80vh', width: '100%' }}>
//               <SpeakerLayout />
//               <CallControls />
//             </div>
//           </StreamCall>
//         </StreamVideo>
//       )}
//     </>
//   );
// };

// export default ChatApp;
