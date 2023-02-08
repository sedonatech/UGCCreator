import React from 'react';
import { isArray } from 'lodash';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import { hp } from '../../../../Utils/getResponsiveSize';
import { IS_ANDROID, SPACE_LARGE } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK, BLACK_40, BLACK_SECONDARY, BRAND_BLUE, DEEP_PURPLE
} from '../../../../theme/Colors';

interface Props {
    tabs: string[],
    selectedTab: string,
    setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
}

const ExploreTabSelector:React.FC<Props> = ({ tabs, selectedTab, setSelectedTab }) => (
    <TemplateBox
        row
        alignItems="center"
        selfCenter
        mv={hp(SPACE_LARGE)}
    >
        {isArray(tabs) && tabs?.map((item) => {
            const isSelected = selectedTab === item;

            return (
                <TemplateBox
                    key={item}
                    onPress={() => {
                        setSelectedTab(item);
                    }}
                    // @ts-ignore
                    hitSlop={{
                        top: hp(SPACE_LARGE),
                        bottom: hp(SPACE_LARGE),
                    }}
                    ml={item === tabs[0] ? 0 : hp(SPACE_LARGE)}
                >
                    <TemplateText
                        underLine={isSelected}
                        size={hp(IS_ANDROID ? 14 : 16)}
                        color={isSelected ? BLACK : BLACK_40}
                        bold
                    >
                        {item}
                    </TemplateText>
                </TemplateBox>
            );
        })}
    </TemplateBox>
);

export default ExploreTabSelector;
