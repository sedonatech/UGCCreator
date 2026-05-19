import React, { FC, useEffect, useRef, useState } from 'react';
import Video, { VideoRef } from 'react-native-video';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { IS_ANDROID, SCREEN_WIDTH } from '../theme/Layout';
import TemplateBox from './TemplateBox';
import upscaleSource from '../Utils/upscaleSource';

interface Props {
    url: string | null;
    onClose: () => void;
}

const VideoOverlay: FC<Props> = ({ url, onClose }) => {
    const videoRef = useRef<VideoRef>(null);
    const [source, setSource] = useState(url);

    useEffect(() => {
        setSource(url);
    }, [url]);

    useEffect(() => {
        const { current } = videoRef;
        if (current && source && !IS_ANDROID) {
            setTimeout(() => {
                videoRef?.current?.presentFullscreenPlayer();
            }, 300);
        }
    }, [source]);

    return IS_ANDROID ? (
        <Modal
            hideModalContentWhileAnimating
            backdropOpacity={1}
            isVisible={source !== null}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            supportedOrientations={['portrait']}
            style={styles.modal}
        >
            <TemplateBox height={(SCREEN_WIDTH / 16) * 8} width={SCREEN_WIDTH} center>
                {!!source && (
                    <Video
                        controls
                        ref={videoRef}
                        paused={!source}
                        source={{ uri: upscaleSource(source, '1080') }}
                        volume={1}
                        playInBackground
                        ignoreSilentSwitch="ignore"
                        resizeMode="contain"
                        repeat
                        mixWithOthers="mix"
                        disableFocus
                        style={styles.androidVideo}
                        onEnd={onClose}
                    />
                )}
            </TemplateBox>
        </Modal>
    ) : (
        (!!source && (
            <Video
                ref={videoRef}
                paused={!url}
                source={{ uri: source }}
                volume={1}
                playInBackground
                ignoreSilentSwitch="ignore"
                resizeMode="contain"
                style={styles.hiddenVideo}
                repeat
                mixWithOthers="mix"
                disableFocus
                onFullscreenPlayerWillDismiss={() => {
                    videoRef.current?.seek(0);
                    onClose();
                    videoRef.current?.dismissFullscreenPlayer();
                }}
            />
        )) || null
    );
};

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
    },
    hiddenVideo: {
        height: 0,
        width: 0,
    },
    androidVideo: {
        height: (SCREEN_WIDTH / 16) * 8,
        width: SCREEN_WIDTH,
    },
});

export default VideoOverlay;
