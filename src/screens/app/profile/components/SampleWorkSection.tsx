import {
    View, StyleSheet, Image, Modal,
    ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
/* eslint-disable max-len */
import React, { FC, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddSampleWorkItem from './AddSampleWorkItem';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { IS_ANDROID, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK, BLACK_40, BLACK_SECONDARY, GREY_SECONDARY, IOS_BLUE, WHITE, WHITE_96
} from '../../../../theme/Colors';
import DynamicIcon from '../../../../components/DynamicIcon';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import TemplateIcon from '../../../../components/TemplateIcon';
import useImageStorage from '../../../../hooks/Portfolio/useImageStorage';
import useFirebaseSetStorage from '../../../../hooks/imageUpload/useFirebaseSetStorage';

interface SampleWork {
    id: string;
    imageUrl: string;
    videoUrl: string;
    title: string;
    subtitle: string;
    creatorId: string;
    creatorName: string;
}

const DUMMY_SAMPLE_WORK: SampleWork[] = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        videoUrl: 'https://www.tiktok.com/@creator/video/123456',
        title: 'TikTok Dance Collab',
        subtitle: 'Viral campaign for BrandX',
        creatorId: 'creator_1',
        creatorName: 'Jane Doe',
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        videoUrl: 'https://www.instagram.com/p/abcdef/',
        title: 'Instagram Reel',
        subtitle: 'Fashion showcase',
        creatorId: 'creator_2',
        creatorName: 'John Smith',
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        videoUrl: 'https://www.youtube.com/watch?v=xyz123',
        title: 'YouTube Review',
        subtitle: 'Tech product review',
        creatorId: 'creator_3',
        creatorName: 'Alex Lee',
    },
];

const CARD_WIDTH = (SCREEN_WIDTH / 2) - 10;
const CARD_HEIGHT = 240;
const CARD_CONTENT_WIDTH = CARD_WIDTH - 8;
const DEFAULT_GRADIENT = ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)'];

interface SampleWorkCardProps {
    item: SampleWork;
    onPress?: () => void;
}

const SampleWorkCard: FC<SampleWorkCardProps> = ({ item, onPress }) => (
    <TemplateTouchable style={styles.cardContainer} onPress={onPress} activeOpacity={0.8} disabled={false}>
        <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={item.title}
        />
        <LinearGradient
            colors={DEFAULT_GRADIENT}
            style={styles.linearGradient}
        />
        <TemplateBox absolute top={16} left={8}>
            <DynamicIcon name="Edit" color={WHITE} />
        </TemplateBox>
        <View style={styles.content}>
            <TemplateText color={WHITE} bold size={14} style={styles.text} numberOfLines={2} adjustsFontSizeToFit>{item.title}</TemplateText>
            <TemplateText color={WHITE} size={13} style={styles.text} numberOfLines={2} adjustsFontSizeToFit>{item.subtitle}</TemplateText>
            <TemplateText color={WHITE} size={12} style={styles.text}>{item.creatorName}</TemplateText>
        </View>
    </TemplateTouchable>
);

const SampleWorkSection: FC = () => {
    const { auth } = useAuthContext();
    const userId = auth?.profile?.id;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const refRBSheet = useRef<RBSheet>(null);
    const { picture, takeAPicture } = useFirebaseSetStorage();
    console.log('🚀 ~ SampleWorkSection ~ picture:', picture);

    const addSampleWork = async (
        sampleWork: SampleWork,
        onSuccess?: () => void,
        onError?: (error: unknown) => void
    ) => {
        if (!userId || !sampleWork || !sampleWork.imageUrl || !sampleWork.title) {
            setError('Missing required fields');
            if (onError) onError('Missing required fields');
            return;
        }
        setLoading(true);
        try {
            await firestore()
                .collection('users')
                .doc(userId)
                .set(
                    {
                        sampleWorks: firestore.FieldValue.arrayUnion(sampleWork),
                    },
                    { merge: true }
                );
            await firestore()
                .collection('showcase')
                .add({
                    ...sampleWork,
                    creatorId: userId,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            setLoading(false);
            setError(null);
            if (onSuccess) onSuccess();
        } catch (err) {
            setLoading(false);
            setError('Error adding sample work');
            if (onError) onError(err);
            console.error('Error adding sample work:', err);
        }
    };

    const handleCardPress = (item: SampleWork) => {};

    const renderItem = ({ item }: { item: SampleWork }) => (
        <SampleWorkCard item={item} onPress={() => handleCardPress(item)} />
    );

    return (
        <TemplateBox flex mt={WRAPPER_MARGIN * 2}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={10}>
                <TemplateText bold color={BLACK} size={18}>My Work Examples</TemplateText>
                <TemplateBox flex />
                <TemplateTouchable onPress={() => refRBSheet.current?.open()} activeOpacity={0.8} disabled={false}>
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        Add
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>
            <TemplateCarousel
                data={DUMMY_SAMPLE_WORK}
                renderItem={renderItem}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={CARD_WIDTH}
                flex
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask
                customStyles={{
                    wrapper: {
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: IS_ANDROID ? WHITE_96 : WHITE,
                        paddingTop: 10,
                        paddingBottom: 40,
                        height: 600,
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >
                <ScrollView>
                    <TemplateBox>
                        <TemplateBox selfCenter alignItems="center">
                            <TemplateText
                                bold
                                size={16}
                                color={BLACK}
                                center
                            >
                                Upload sample photos
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={12}
                                color={BLACK}
                                center
                            >
                                You can upload up to 4 variants of
                                your links to your sample photos on your social media
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox pAll={WRAPPER_MARGIN}>

                            <TemplateBox mb={30} alignItems="center" justifyContent="center" backgroundColor={WHITE}>
                                <TemplateBox>
                                    <TemplateBox mt={10}>
                                        <TemplateBox mv={10}>
                                            <TemplateText size={12} bold>Link</TemplateText>
                                            <TemplateTextInput
                                                placeholder="Video Link"
                                                placeholderTextColor={BLACK_40}
                                                style={styles.shortInput}
                                                value={[]}
                                                onChangeText={(text) => []}
                                                autoCapitalize="none"
                                            />
                                        </TemplateBox>
                                        <TemplateBox mv={10}>
                                            <TemplateText size={12} bold>Title</TemplateText>
                                            <TemplateTextInput
                                                placeholder="Title"
                                                placeholderTextColor={BLACK_40}
                                                style={styles.shortInput}
                                                value={[]}
                                                onChangeText={(text) => {}}
                                                autoCapitalize="none"
                                            />
                                        </TemplateBox>
                                        <TemplateBox mv={10}>
                                            <TemplateText size={12} bold>Description</TemplateText>
                                            <TemplateTextInput
                                                placeholder="Description"
                                                placeholderTextColor={BLACK_40}
                                                style={styles.shortInput}
                                                value={[]}
                                                onChangeText={(text) => {}}
                                                autoCapitalize="none"
                                                maxLength={100}
                                                multiline
                                            />
                                        </TemplateBox>
                                    </TemplateBox>
                                </TemplateBox>
                                <TemplateBox
                                    row
                                    alignItems="center"
                                    backgroundColor={BLACK_SECONDARY}
                                    borderRadius={10}
                                    mt={WRAPPER_MARGIN}
                                    onPress={() => takeAPicture()}
                                    ph={WRAPPER_MARGIN * 2}
                                    pv={16}
                                    selfCenter
                                >
                                    <TemplateIcon name="add-outline" color={WHITE} size={16} />
                                    <TemplateBox width={5} />
                                    <TemplateText color={WHITE} bold size={12}>Upload Cover Photo</TemplateText>
                                </TemplateBox>
                            </TemplateBox>

                        </TemplateBox>
                    </TemplateBox>
                </ScrollView>
            </RBSheet>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
        paddingVertical: 18,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        marginRight: 15,
        overflow: 'hidden',
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        position: 'absolute',
        zIndex: -1,
    },
    linearGradient: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
    },
    content: {
        position: 'absolute',
        left: 10,
        bottom: 20,
        width: CARD_CONTENT_WIDTH,
    },
    text: {
        marginBottom: 4,
    },
    shortInput: {
        height: 40,
        width: SCREEN_WIDTH - (WRAPPER_MARGIN * 2),
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 5,
        color: BLACK,
    },
});

export default SampleWorkSection;
