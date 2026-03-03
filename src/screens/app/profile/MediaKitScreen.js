import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { WHITE } from '../../../theme/Colors';

const MediaKitScreen = ({ route }) => {
    const uri = route?.params?.uri;
    const page = route?.params?.page || 1;

    return (
        <View style={styles.container}>
            <Pdf
                source={uri ? { uri, cache: true } : null}
                page={page}
                trustAllCerts={false}
                style={styles.pdf}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log('[MEDIA-KIT]: pages', numberOfPages);
                    console.log('[MEDIA-KIT]: filePath', filePath);
                }}
                onPageChanged={p => console.log('[MEDIA-KIT]: page', p)}
                onError={e => console.log('[MEDIA-KIT]: error', e)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default MediaKitScreen;
