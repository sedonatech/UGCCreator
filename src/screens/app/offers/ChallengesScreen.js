import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TemplateText from '../../../components/TemplateText';
import { TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import { HEADER_MARGIN, IS_ANDROID } from '../../../theme/Layout';
import useChallenge from '../../../hooks/useChallenge';
import ChallengeCard from '../home/components /ChallengeCard';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { CHALLENGE_DETAILS } from '../../../navigation/ScreenNames';

const ChallengesScreen = ({ navigation }) => {
    const { auth } = useAuthContext();
    const profile = auth?.profile;
    const { challenges, challengeLoading, getStatusLabel, canEnrollNow } = useChallenge();

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center" mb={20}>
                        <TemplateText size={18} startCase bold>
                            Challenges
                        </TemplateText>
                    </TemplateBox>
                }
                data={challenges}
                keyExtractor={item => item?.id}
                renderItem={({ item }) => (
                    <TemplateBox selfCenter alignItems="center" justifyContent="center" mb={16}>
                        <ChallengeCard
                            loading={challengeLoading}
                            prizePoolUsd={item?.prizePoolUsd}
                            challengeTitle={item?.title}
                            challengeId={item?.id}
                            currentUserId={profile?.id}
                            userName={profile?.userName}
                            userEmail={profile?.email}
                            shortDescriptionSegments={item?.shortDescriptionSegments}
                            enrollmentStartAt={item?.enrollmentStartAt?.toDate()}
                            challengeStartAt={item?.challengeStartAt?.toDate()}
                            challengeEndAt={item?.challengeEndAt?.toDate()}
                            getStatusLabel={getStatusLabel}
                            canEnrollNow={canEnrollNow}
                            onPress={() =>
                                navigation.navigate(CHALLENGE_DETAILS, {
                                    challengeId: item?.id,
                                })
                            }
                            secondaryOnPress={() =>
                                navigation.navigate(CHALLENGE_DETAILS, {
                                    challengeId: item?.id,
                                })
                            }
                        />
                    </TemplateBox>
                )}
                initialNumToRender={5}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
});
export default ChallengesScreen;
