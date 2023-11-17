import React, {
    FC, useEffect, useRef, useState
} from 'react';
import Video from 'react-native-video';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
import { StyleSheet, } from 'react-native';
import Modal from 'react-native-modal';

import { IS_ANDROID, SCREEN_WIDTH } from '../theme/Layout';
import TemplateBox from './TemplateBox';
import upscaleSource from '../Utils/upscaleSource';

interface Props {
    url: string | null,
    onClose: ()=>void
}

const VideoOverlay:FC<Props> = ({ url, onClose }) => {
    const videoRef = useRef(null);
    const [source, setSource] = useState(url);
    useEffect(() => {
        setSource(url);
    }, [url]);
    useEffect(() => {
        const { current } = videoRef;
        if (current && source) {
            if (!IS_ANDROID) {
                setTimeout(() => {
                    // @ts-ignore
                    !!videoRef && videoRef?.current.presentFullscreenPlayer();
                }, 300);
            }
        }
    }, [source, videoRef]);

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
            <TemplateBox
                height={(SCREEN_WIDTH / 16) * 8}
                width={SCREEN_WIDTH}
                center
            >
                <VideoPlayer
                    controls
                    ref={videoRef}
                    paused={!source}
                    source={!!source && {
                        uri: upscaleSource(source, '1080'),
                    }}
                    volume={1}
                    playInBackground
                    ignoreSilentSwitch="ignore"
                    resizeMode="contain"
                    repeat
                    mixWithOthers="mix"
                    disableFocus
                    onBack={() => onClose()}
                    onEnterFullscreen
                    onExitFullscreen={() => {
                        onClose();
                    }}
                />
            </TemplateBox>
        </Modal>
    ) : ((!!source && (
        <Video
            ref={videoRef}
            paused={!url}
            // @ts-ignore
            source={!!source && {
                uri: source,
            }}
            volume={1}
            playInBackground
            ignoreSilentSwitch="ignore"
            resizeMode="contain"
            style={!(source && IS_ANDROID) && styles.hiddenVideo}
            repeat
            mixWithOthers="mix"
            disableFocus
            onFullscreenPlayerWillDismiss={() => {
                // @ts-ignore
                videoRef.current.seek(0);
                onClose();
                // @ts-ignore
                videoRef.current.dismissFullscreenPlayer();
            }}
        />
    )) || null);
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
});
export default VideoOverlay;
