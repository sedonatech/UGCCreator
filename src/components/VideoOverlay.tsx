import React, {
    FC,
    useEffect, useLayoutEffect, useState,
} from 'react';
import Video from 'react-native-video';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
import { get, isObject } from 'lodash';
import { StyleSheet, View, } from 'react-native';
import Modal from 'react-native-modal';
import { isAndroid } from '../Utils/Platform';
import { SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT } from '../theme/Layout';
import { BLACK } from '../theme/Colors';

const upscaleSource = (baseUrl: string | null, quality = '720') => {
    if (!baseUrl) return null;
    return baseUrl.replace(/(\d\d\d\.mp4)$/g, `${quality}.mp4`);
};

interface Props {
    url: string | null,
    name: string,
    onClose: ()=>void,
    muted: boolean,
    upscale: boolean,
    onShow: ()=>void,
    landscape: boolean,
}

// @ts-ignore
const VideoOverlay:FC<Props> = React.forwardRef(({
    url,
    name = 'default',
    onClose,
    muted = true,
    upscale = false,
    onShow,
    landscape
}, ref) => {
    const videoRef: any = ref;
    const [source, setSource] = useState<any>(upscale ? upscaleSource(url) : url);

    useEffect(() => {
        if (url) {
            // setSource(upscaleSource(url));
            setSource(upscale ? upscaleSource(url) : url);
        }
        console.log('[Video overlay] - url', url);
    }, [url]);

    useEffect(() => {
        if (!url) {
            setSource(null);
            console.log(`[Video Overlay] ${name}  - cleaning source`);
        }
    }, [url]);

    useLayoutEffect(() => {
        if (get(videoRef, 'current') && source !== null && !isAndroid) {
            setTimeout(() => {
                console.log(`[Video Overlay] ${name}  - presenting full screen player`);
                videoRef.current.presentFullscreenPlayer();
            }, 100);
        }

        console.log(`[Video Overlay] ${name}  - trigger`, isObject(get(videoRef, 'current')), source);
    }, [source, videoRef]);

    return isAndroid
        ? (
            <Modal
                hideModalContentWhileAnimating
                backdropOpacity={1}
                isVisible={source !== null}
                onBackdropPress={onClose}
                onBackButtonPress={onClose}
                onShow={onShow}
                supportedOrientations={['portrait', 'landscape']}
                style={styles.modal}
            >
                <View
                    style={landscape
                        ? styles.androidContainerLandscape
                        : styles.androidContainerPortrait}
                >
                    <VideoPlayer
                        ref={videoRef}
                        paused={!source}
                        source={!!source && {
                            uri: source,
                        }}
                        volume={1}
                        playInBackground
                        ignoreSilentSwitch="ignore"
                        resizeMode="contain"
                        style={landscape
                            ? styles.videoAndroidLandscape
                            : styles.videoAndroidPortrait}
                        muted={muted}
                        repeat
                        mixWithOthers="mix"
                        disableFocus
                        onBack={() => onClose()}
                        onEnterFullscreen
                        onExitFullscreen={() => {
                            onClose();
                        }}
                        onError={(err: any) => {
                            console.log('video overlay err', err);
                        }}
                        // disableVolume
                    />
                </View>
            </Modal>
        )
        : !!source && (
            <Video
                ref={videoRef}
                paused={!url}
                // @ts-ignore
                source={!!source && {
                    uri: source,
                }}
                volume={0}
                playInBackground
                ignoreSilentSwitch="ignore"
                resizeMode="contain"
                style={source && isAndroid ? styles.video : styles.hiddenVideo}
                muted={muted}
                repeat
                mixWithOthers="mix"
                disableFocus
                onFullscreenPlayerWillDismiss={() => {
                    videoRef.current.seek(0);
                    onClose();
                    videoRef.current.dismissFullscreenPlayer();
                }}
                onFullscreenPlayerWillPresent={() => {
                    console.log('[Video Overlay] - Video will open', get(videoRef, 'current.props.source'));
                }}
                onFullscreenPlayerDidDismiss={() => {
                    console.log('[Video Overlay] - Video has Closed', get(videoRef, 'current.props.source'));
                }}
                onError={(err) => {
                    console.log('video overlay err', err);
                }}
            />
        );
});

const styles = StyleSheet.create({
    video: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: BLACK,
        overflow: 'hidden',
        position: 'absolute',
    },
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
    videoAndroidPortrait: {
        height: SCREEN_HEIGHT * 0.9,
        width: SCREEN_WIDTH,
        backgroundColor: BLACK,
        overflow: 'hidden',
        position: 'absolute',
    },
    androidContainerPortrait: {
        height: (SCREEN_WIDTH / 16) * 8,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
    },
    videoAndroidLandscape: {
        height: SCREEN_WIDTH,
        width: SCREEN_HEIGHT - STATUS_BAR_HEIGHT,
    },
    androidContainerLandscape: {
        height: SCREEN_WIDTH - 50,
        width: SCREEN_HEIGHT - STATUS_BAR_HEIGHT,
    },
    androidCloseIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
    },
});

export default VideoOverlay;
