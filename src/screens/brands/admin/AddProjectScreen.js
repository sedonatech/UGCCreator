import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Blob from '../../../../assets/svgs/Blob';
import {
    BLACK, DEEP_LAVENDER, LAVENDER, WHITE,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import TemplateTouchable from '../../../components/TemplateTouchable';
import TemplateIcon from '../../../components/TemplateIcon';
import Button from '../../../components/Button';

const AddProjectScreen = () => (
    <ScrollView style={styles.container}>
        <View>
            <Blob top />
            <Blob right color={LAVENDER} />
            <Blob color={LAVENDER} bottom />
            <Blob center />
        </View>
        <TemplateText
            bold
            color={BLACK}
            size={18}
            startCase
            style={styles.title}
            center
        >
            Add a new project
        </TemplateText>

        <TemplateTextInput
            placeholder="Project title"
            style={styles.input}
            autoCapitalize="none"
        />
        <TemplateTextInput
            placeholder="Short description"
            style={styles.input}
            autoCapitalize="none"
            maxLength={20}
        />
        <TemplateTextInput
            placeholder="Description"
            style={[styles.input, styles.multiline]}
            autoCapitalize="none"
            multiline
            numberOfLines={20}
        />
        <TemplateTouchable style={styles.inputButton}>
            <TemplateIcon
                name="camera-outline"
                family="Ionicons"
                color={DEEP_LAVENDER}
                size={20}
            />
        </TemplateTouchable>

        <View style={styles.multiInputWrapper}>
            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="calendar-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    Start date
                </TemplateText>
            </TemplateTouchable>

            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="calendar-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    end date
                </TemplateText>
            </TemplateTouchable>

            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="cash-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    Min budget
                </TemplateText>
            </TemplateTouchable>

            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="cash-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    Max budget
                </TemplateText>
            </TemplateTouchable>
            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="videocam-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    Video required
                </TemplateText>
            </TemplateTouchable>

            <TemplateTouchable style={[styles.inputButton, styles.smallInput]}>
                <TemplateIcon
                    name="images-outline"
                    family="Ionicons"
                    color={DEEP_LAVENDER}
                    size={20}
                />
                <TemplateText
                    size={12}
                    color={DEEP_LAVENDER}
                    startCase
                    style={styles.smallInputTitle}
                >
                    Images required
                </TemplateText>
            </TemplateTouchable>
        </View>

        <Button
            title="Create Project"
            onPress={() => {}}
            style={styles.button}
            loading={false}
            disabled={false}
        />
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    title: {
        marginTop: SCREEN_HEIGHT * 0.14,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: WRAPPER_MARGIN * 2,
        borderColor: DEEP_LAVENDER,
        alignSelf: 'center',
    },
    multiline: {
        height: 130,
    },
    inputButton: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderRadius: 8,
        marginTop: WRAPPER_MARGIN * 2,
        borderColor: DEEP_LAVENDER,
        borderStyle: 'dashed',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    multiInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        marginTop: WRAPPER_MARGIN * 2,
    },
    smallInput: {
        width: (SCREEN_WIDTH - 52) / 2,
    },
    smallInputTitle: {
        marginLeft: 10,
    },
    button: {
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
    },
});
export default AddProjectScreen;
