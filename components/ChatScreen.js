import styled from 'styled-components';
import {auth, db} from '../firebase';
import {useRouter} from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import {useCollection} from 'react-firebase-hooks/firestore';
import Message from './Message';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useRef, useState } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react'




function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const [endOfMessagesRef] = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(db
    .collection('chats')
    .doc(router.query.id).collection('messages')
    .orderBy('timestamp', 'asc'));

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)))

    const showMessages = () => {
      if (messagesSnapshot){
        return messagesSnapshot.docs.map((message) =>(
        <Message 
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
        } else {
          return JSON.parse(messages).map(message => (
            <Message key={message.id} user={message.user} message={message} />
          ))
        }
    };

    const scrollToBottom = () => {
      endOfMessagesRef = current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    const sendMessage = (e) => {
      e.preventDefault();

      // updating user lastSeen...
      db.collection("users").doc(user.uid).set(
        {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, 
      {merge: true}
      );
      db.collection('chats').doc(router.query.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      })
      setInput('');
      scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL}/>
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>Last active: {' '}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ): 'Unavailable'}</p>
          ): (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcon>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcon>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef}/>
      </MessageContainer>

      <InputConatainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Messaage</button>
        <MicIcon />
      </InputConatainer>
    </Container>
  );
}

export default ChatScreen;


const Container = styled.div`

`;
 
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcon = styled.div`
`;

const MessageContainer = styled.div`
  
`;

const EndOfMessage = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh; 
`;
const InputConatainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  color: black;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;