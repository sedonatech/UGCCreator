import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH,
} from '../../../theme/Layout';
import { BLACK, LIGHT_PURPLE, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { wp } from '../../../Utils/getResponsiveSize';
import { WEBVIEW } from '../../../navigation/ScreenNames';



import type { StackNavigationProp } from '@react-navigation/stack';
import isAndroid from '../../subscriptions/utils/isAndroid';
import { UserGeneratedContentBrandDealLead, userGeneratedContentBrandDealsSearch } from '../../../hooks/content/useUserGeneratedContentBrandDealsSearch';


type BrandDealsScreenProps = {
    navigation: StackNavigationProp<any>;
};

const BrandDealsScreen = ({ navigation }: BrandDealsScreenProps) => {
   const functionsBaseAddress =  'https://us-central1-ugccreatorapp.cloudfunctions.net';
   
   const {
                status: brandDealsStatus,
                leads: brandDealsLeads,
                error: brandDealsError,
                refresh: refreshBrandDeals,
                hasAnyResults: hasAnyBrandDealsResults,
            } = userGeneratedContentBrandDealsSearch({
                backendEndpoint: `${functionsBaseAddress}/userGeneratedContentBrandDealsSearch`,
                shouldFetchOnMount: true,
                requestTimeoutInMilliseconds: 15000,
        });

    const renderItem = ({ item }: { item: UserGeneratedContentBrandDealLead }) => (
        <TemplateBox
            borderRadius={wp(16)}
            backgroundColor={LIGHT_PURPLE}
            pAll={wp(16)}
            onPress={() => navigation.navigate(WEBVIEW, { url: item?.applicationLink })}
            width={WRAPPED_SCREEN_WIDTH}
            height={wp(110)}
            mb={wp(16)}
            center
            selfCenter
        >
            <TemplateText
                startCase
                size={wp(16)}
                semiBold
            >
                {item?.brandName}
            </TemplateText>
            <TemplateBox height={wp(8)} />
            <TemplateText
                size={wp(12)}
            >
             {item?.roleTitle}
            </TemplateText>
        </TemplateBox>
    );

    const [limit, setLimit] = useState(6);


    return (
        <TemplateBox flex backgroundColor={WHITE} alignItems="center">
            <FlatList
                style={styles.container}
                ListHeaderComponent={
                    <TemplateBox pb={wp(16)} alignItems="center" width={WRAPPED_SCREEN_WIDTH}>
                        <TemplateText semiBold size={16} mb={wp(8)}>Brand Deals</TemplateText>
                        <TemplateText
                            size={13}
                            color={BLACK}
                            center
                        >
                            Social media, UGC and brand partnerships handpicked for you.
                        </TemplateText>
                  </TemplateBox>
                }
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                data={brandDealsLeads?.slice(0, limit)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.identifier}-${index}`}
                initialNumToRender={10}
                onEndReachedThreshold={0}
                onEndReached={() => { setLimit((prevLimit) => prevLimit + 4); }}
            />
        </TemplateBox>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        marginTop: HEADER_MARGIN,
     
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
    },
});
export default BrandDealsScreen;
