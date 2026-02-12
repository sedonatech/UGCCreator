import { Alert, StyleSheet } from 'react-native';
import React, { FC, useState } from 'react';
import RNRestart from 'react-native-restart';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
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
import useTranslation from '../../hooks/useTranslation';

interface Props {
    onClose?: () => void;
    visible: boolean;
}

interface AuthError {
    code?: string;
    message?: string;
}

const DeleteUserModal: FC<Props> = ({ onClose = () => {}, visible = false }) => {
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const onModalClose = (): void => {
        onClose();
        setError(null);
        setPassword('');
    };

    const logOut = async (): Promise<void> => {
        const allKeys = await AsyncStorage.getAllKeys();
        if (allKeys?.length > 0) {
            await AsyncStorage.multiRemove(allKeys);
        }
        await auth().signOut();
        RNRestart.Restart();
    };

    const reauthenticateAndDeleteUser = (): void => {
        setLoading(true);
        const user: FirebaseAuthTypes.User | null = auth().currentUser;

        if (user) {
            const email: string | null = user.email;
            if (!email) {
                setLoading(false);
                Alert.alert(t('modals.deleteUser.alerts.noEmail'));
                return;
            }

            const credential = auth.EmailAuthProvider.credential(email, password);

            user.reauthenticateWithCredential(credential)
                .then(() => {
                    // User re-authenticated, now delete the account
                    return user.delete();
                })
                .then(() => {
                    setLoading(false);
                    Alert.alert(t('modals.deleteUser.alerts.success'));
                    logOut();
                })
                .catch((error: AuthError) => {
                    setLoading(false);
                    if (error.code === 'auth/wrong-password') {
                        Alert.alert(t('modals.deleteUser.alerts.wrongPassword'));
                    } else {
                        Alert.alert(t('modals.deleteUser.alerts.error'), error.message);
                    }
                });
        } else {
            setLoading(false);
            Alert.alert(t('modals.deleteUser.alerts.noUser'));
        }
    };

    return (
        <ModalBase visible={visible} closeOnPress={onClose}>
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
                        <TemplateText semiBold center>
                            {t('modals.deleteUser.warning')}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText size={hp(14)} mt={20} center>
                        {t('modals.deleteUser.instruction')}
                    </TemplateText>
                    <TemplateBox width="100%" mt={hp(20)}>
                        <TemplateTextInput
                            placeholder={t('modals.deleteUser.passwordPlaceholder')}
                            style={[styles.input, SHADOW('default', WHITE)]}
                            value={password}
                            onChangeText={(text: string) => setPassword(text)}
                            autoCapitalize="none"
                            focus={false}
                            disabled={false}
                            placeholderTextColor={BLACK}
                            placeholderStyle={styles.inputTextStyle}
                        />
                        {error && (
                            <TemplateText mt={8} color={ERROR_RED} center>
                                {error}
                            </TemplateText>
                        )}
                    </TemplateBox>

                    <TemplateBox mt={hp(25)} row onPress={() => console.log('press')}>
                        <Button
                            title={t('modals.deleteUser.confirmButton')}
                            onPress={reauthenticateAndDeleteUser}
                            style={{ width: wp(150), borderRadius: hp(12), backgroundColor: ERROR_RED, height: hp(45) }}
                            loading={loading}
                        />
                        <TemplateBox height={'100%'} width={wp(10)} />
                        <Button
                            title={t('modals.deleteUser.cancelButton')}
                            onPress={onModalClose}
                            style={{ width: wp(150), borderRadius: hp(12), height: hp(45) }}
                            loading={false}
                        />
                    </TemplateBox>
                </TemplateBox>
            </KeyboardAwareScrollView>
        </ModalBase>
    );
};

export default DeleteUserModal;

const styles = StyleSheet.create({
    contentContainerStyle: {
        flex: 1,
        justifyContent: 'center',
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
