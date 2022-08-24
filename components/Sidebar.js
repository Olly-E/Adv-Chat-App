import { Avatar, IconButton } from "@mui/material";
import styled from "styled-components";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

const Sidebar = () => {
  return (
    <Container>
        <Header>
            <UserAvatar />
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
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`

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