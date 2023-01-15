import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
const useGetCreators = () => {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        setCreators(
          querySnapshot?.docs
            ?.map(doc => doc?.data())
            ?.filter(({type}) => type === 'creator'),
        );
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return {
    creators,
  };
};

export default useGetCreators;
