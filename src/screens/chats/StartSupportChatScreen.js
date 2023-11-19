import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StartSupportChatScreen = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>StartSupportChatScreen</Text>
        </View>
    );
};

export default StartSupportChatScreen;
