import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import Chat from "./Chat";



const Sidebar = () => {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () => {
        const input = prompt(
            'please enter an email address for the user you intend to chat with'
        );
        if(!input) return null;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
            // this is where we need to add the chat in the db chat collection if it doesnt exist and it's valid
            db.collection("chats").add({
                users: [user.email, input],
            })
        }
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
            );


  return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
            <IconsContainer>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
                <IconButton>
                    <ChatIcon />
                </IconButton>
            </IconsContainer>
        </Header>
        <Search>
            <SearchIcon />
            <SearchInput placeholder="search in chats" />
        </Search>
        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
        {/* List of chats */}
        {chatsSnapshot?.docs.map(chat => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 380px;
    max-width: 350px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    --ms-overflow-style: none;
    scrollbar-width: none;
`;
const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 15px;
    border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;
const IconsContainer = styled.div``;
const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;
const SearchInput = styled.input`
    outline-width: 0;
    background: white;
    border: none;
    flex: 1;
    color: black;
`;
const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;