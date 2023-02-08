import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateText from '../../../components/TemplateText';

import { hp } from '../../../Utils/getResponsiveSize';
import { SPACE_LARGE } from '../../../theme/Layout';
import { BLACK_SECONDARY, LAVENDER, WHITE } from '../../../theme/Colors';
import Blob from '../../../../assets/svgs/Blob';
import useGetCreators from '../../../hooks/brands/useGetCreators';
import ContentSection from '../admin/components/ContentSection';
import TemplateTouchable from '../../../components/TemplateTouchable';
import { ADD_PROJECT } from '../../../navigation/ScreenNames';
import TemplateIcon from '../../../components/TemplateIcon';

const CreatorProfilesScreen = ({ navigation }) => {
    const { creators } = useGetCreators();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateTouchable style={styles.addButton} onPress={() => {}}>
                    <TemplateIcon
                        color={WHITE}
                        name="filter"
                        size={14}
                        family="Ionicons"
                    />
                    <TemplateText
                        bold
                        caps
                        size={10}
                        color={WHITE}
                        style={styles.addButtonText}
                    >
                        filters
                    </TemplateText>
                </TemplateTouchable>
            ),
        });
    }, [navigation]);
    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <Blob color={LAVENDER} top />
            <Blob right />
            <Blob color={LAVENDER} bottom />
            <Blob center />
            <TemplateText
                size={20}
                bold
                caps
                color={BLACK_SECONDARY}
                style={styles.title}
            >
                Creator Profiles
            </TemplateText>
            {!!creators?.length
        && creators?.map((creator, index) => (
            <ContentSection
                key={creator?.id}
                creator={creator}
                isLast={creator === creators[creators?.length - 1]}
                slideInTime={(index + 1) * 100}
            />
        ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: WHITE,
    },
    scrollContainer: {
        paddingTop: hp(SPACE_LARGE),
        paddingBottom: hp(SPACE_LARGE),
        flexGrow: 1,
        backgroundColor: WHITE,
    },
    addButton: {
        marginRight: 20,
        height: 30,
        borderRadius: 10,
        backgroundColor: BLACK_SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        flexDirection: 'row',
    },
    addButtonText: {
        marginLeft: 5,
    },
    title: {
        marginLeft: 20,
        marginBottom: 20,
        marginTop: 80,
    },
});
export default CreatorProfilesScreen;
