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

// const generateChannelId = (id1, id2) => [id1, id2].sort().join('-');

// const ChatApp = () => {
//   const { receiverId } = useParams(); // expects receiverId (doctorId-patientId)
//   const [chatClient, setChatClient] = useState(null);
//   const [activeChannel, setActiveChannel] = useState(null);

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const res = await fetch('http://localhost:1600/api/stream/token', {
//           credentials: 'include'
//         });

//         const { token, userId, apiKey } = await res.json();

//         if (!userId || !receiverId) {
//           console.error("❌ Missing userId or receiverId", { userId, receiverId });
//           return;
//         }

//         const [doctorId, patientId] = receiverId.split('-');
//         const peerId = userId === doctorId ? patientId : doctorId;

//         const client = StreamChat.getInstance(apiKey);
//         await client.connectUser({ id: userId }, token);

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

//         const channelId = generateChannelId(userId, peerId);

//         const channel = client.channel('messaging', channelId, {
//           members: [userId, peerId]
//         });

//         await channel.watch();

//         setChatClient(client);
//         setActiveChannel(channel);
//       } catch (err) {
//         console.error('🚨 Stream setup error:', err);
//       }
//     };

//     initChat();

//     return () => {
//       if (chatClient) chatClient.disconnectUser();
//     };
//   }, [receiverId]);

//   if (!chatClient || !activeChannel) return <LoadingIndicator />;

//   return (
//     <Chat client={chatClient} theme="messaging light">
//       <Channel channel={activeChannel}>
//         <Window>
//           <ChannelHeader />
//           <MessageList />
//           <MessageInput />
//         </Window>
//       </Channel>
//     </Chat>
//   );
// };

// export default ChatApp;




import { StreamChat } from 'stream-chat';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import toast for notifications
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
import CallButton from './CallButton'; // Assuming you have a CallButton component in a separate file

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



  const handleVideoCall = () => {
    if (!activeChannel) {
      console.error("❌ No active channel to initiate a video call");
      return;
    }
    const channelId = activeChannel.id;
    const callUrl = `${window.location.origin}/api/video-call/${channelId}`;  
    activeChannel.sendMessage({
      text: `Video call initiated. Join here: ${callUrl}`
    })
    toast.success("Video call link sent in chat!");
  }
  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={activeChannel}>
        <CallButton handleVideoCall={handleVideoCall} />
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

