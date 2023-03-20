import { useContext } from 'react';
import { ChatsContext } from '../../context/ChatsProvider';

const useChatsContext = () => {
    const chatsContext = useContext(ChatsContext);

    return chatsContext;
};

export default useChatsContext;
