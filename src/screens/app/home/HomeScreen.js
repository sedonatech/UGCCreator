import React from 'react';
import auth from '@react-native-firebase/auth';

import TemplateIcon from '../../../components/TemplateIcon';
import Wrapper from '../../../components/Wrapper';
import TemplateText from '../../../components/TemplateText';
import Button from '../../../components/Button';
import {Alert} from 'react-native';

const HomeScreen = () => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!')),
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <Wrapper>
      <TemplateText>HomeScreen</TemplateText>

      <Button onPress={handleLogout} title="logout" />
        <TemplateIcon name="chat-processing-outline" />

        <TemplateIcon name="chat-processing-outline" />
    </Wrapper>
  );
};

export default HomeScreen;
