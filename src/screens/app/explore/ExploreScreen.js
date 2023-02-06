import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateText from '../../../components/TemplateText';
import { BLACK, LAVENDER, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../asssets/svgs/Blob';
import TemplateTextInput from '../../../components/TemplateTextInput';
import {
    SCREEN_HEIGHT, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { SHADOW } from '../../../theme/Shadow';
import TemplateIcon from '../../../components/TemplateIcon';
import TemplateTouchable from '../../../components/TemplateTouchable';
import ExploreTabSelector from './components/ExploreTabSelector';
import BrandsTab from './BrandsTab';
import ProjectsTab from './ProjectsTab';

const BRANDS_TAB = 'Brands';
const PROJECTS_TAB = 'Projects';

const TABS = [BRANDS_TAB, PROJECTS_TAB];

const ExploreScreen = () => {
    const [search, setSearch] = useState('');

    const [selectedTab, setSelectedTab] = useState(TABS[0]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

            <TemplateBox mt={SCREEN_HEIGHT * 0.15} alignItems="center" justifyContent="center">
                <TemplateText size={18} bold>Explore Brands and Projects</TemplateText>
            </TemplateBox>
            <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                <TemplateTextInput
                    placeholder="Search"
                    style={[styles.input, SHADOW('default', WHITE)]}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    autoCapitalize="none"
                />
                <TemplateTouchable onPress={() => ''} style={styles.filterButton}>
                    <TemplateIcon name="filter-outline" size={24} color={BLACK} />
                </TemplateTouchable>
            </TemplateBox>

            <ExploreTabSelector
                tabs={TABS}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />

            {selectedTab === BRANDS_TAB && (
                <BrandsTab />
            )}
            {selectedTab === PROJECTS_TAB && (
                <ProjectsTab />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        color: BLACK,
    },
    filterButton: {
        position: 'absolute',
        right: WRAPPER_MARGIN,
        bottom: 13,
    },
});
export default ExploreScreen;
