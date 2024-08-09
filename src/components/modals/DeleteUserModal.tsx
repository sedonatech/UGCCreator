import { Alert, StyleSheet } from 'react-native';
import React, {
    FC, useState
} from 'react';
import RNRestart from 'react-native-restart';
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TemplateBox from '../TemplateBox';
import ModalBase from './ModalBase';
import { hp, wp } from '../../Utils/getResponsiveSize';
import { BLACK, ERROR_RED, WHITE, WHITE_10 } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import TemplateTextInput from '../TemplateTextInput';
import { SHADOW } from '../../theme/Shadow';
import Button from '../Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    onClose?: () => void;
    visible: boolean;
}

const DeleteUserModal: FC<Props> = ({
    onClose = () => {},
    visible = false,
}) => {

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const onModalClose = () => {
        onClose();
        setError(null);
        setPassword('')
    };

    const logOut = async () => {
        const allKeys = await AsyncStorage.getAllKeys();
        if (allKeys?.length > 0) {
            await AsyncStorage.multiRemove(allKeys);
        }
        await auth().signOut();
        RNRestart.Restart();
    }

    const reauthenticateAndDeleteUser = () => {
        setLoading(true)
        const user = auth().currentUser;
    
        if (user) {
          const credential = auth.EmailAuthProvider.credential(
            user.email,
            password
          );
    
          user.reauthenticateWithCredential(credential)
            .then(() => {
              // User re-authenticated, now delete the account
              return user.delete();
            })
            .then(() => {
            setLoading(false)
              Alert.alert('User deleted successfully.');
              logOut()
            })
            .catch((error) => {
            setLoading(false)
              if (error.code === 'auth/wrong-password') {
                Alert.alert('The password is incorrect.');
              } else {
                Alert.alert('Error during re-authentication or deletion:', error.message);
              }
            });
           
        } else {
            setLoading(false)
          Alert.alert('No user is currently signed in.');
        }
      };

  
    return (
             <ModalBase
                visible={visible}
                closeOnPress={onClose}
                animationInTiming={250}
            >
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles?.contentContainerStyle}
            >
                <TemplateBox
                    pv={hp(25)}
                    ph={wp(20)}
                    mh={wp(20)}
                    mb={wp(20 * 2)}
                    borderRadius={hp(15)}
                    backgroundColor={WHITE}
                >
                    <TemplateBox mb={16}>
                        <TemplateText semiBold  center>
                            Please note by taking this action you are permanently deleting your account and all data associated.
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText size={hp(14)} mt={20} center>
                        {'Should you wish to proceed, please enter your password'}
                    </TemplateText>
                    <TemplateBox width="100%" mt={hp(20)}>
                        <TemplateTextInput
                            placeholder="Password"
                            style={[styles.input, SHADOW('default', WHITE)]}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            autoCapitalize="none"
                        />
                        {error && (
                            <TemplateText
                                mt={8}
                                color={ERROR_RED}
                                bodyXS
                                center
                            >
                                {error}

                            </TemplateText>
                        )}
                    </TemplateBox>

                    <TemplateBox
                        mt={hp(25)}
                        row
                        onPress={()=> console.log('press')}
                    >
                        <Button
                            title="confirm"
                            onPress={reauthenticateAndDeleteUser}
                            style={{width: wp(150), borderRadius: hp(12), backgroundColor: ERROR_RED, height: hp(45)}}
                            loading={loading}
                         />
                        <TemplateBox height={'100%'} width={wp(10)} />
                        <Button
                            title="Cancel"
                            onPress={onModalClose}
                            style={{width: wp(150), borderRadius: hp(12), height: hp(45)}}
                            loading={false}
                         />
                    </TemplateBox>
                </TemplateBox>

            </KeyboardAwareScrollView>
        </ModalBase>

    );
};

export default DeleteUserModal;

const styles =  StyleSheet.create({
    contentContainerStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 10,
        fontSize: 16,
        color: BLACK,
     },
      tags: {
        backgroundColor: WHITE_10,
        borderWidth: 1,
        // borderColor: colors?.secondary,
        borderRadius: hp(10),
      },
      inputTextStyle: {
        color: WHITE,
      },
});
