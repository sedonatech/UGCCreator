import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import TemplateText from '../../../components/TemplateText';
import auth from '@react-native-firebase/auth';
import Wrapper from '../../../components/Wrapper';
import {WHITE} from '../../../theme/Colors';
import Button from '../../../components/Button';

const ProfileScreen = () => {
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
          onPress: async () => {
            try {
              const response = await auth().signOut();
              console.log('-> response', JSON.stringify(response, null, 2));
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Wrapper contentContainerStyle={styles.container}>
      <TemplateText>ProfileScreen </TemplateText>
      <Button onPress={handleLogout} title="logout" />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
export default ProfileScreen;
