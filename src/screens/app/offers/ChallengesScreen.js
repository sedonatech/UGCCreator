import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TemplateText from '../../../components/TemplateText';
import { TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import { HEADER_MARGIN, IS_ANDROID } from '../../../theme/Layout';
import useChallenge from '../../../hooks/useChallenge';
import ChallengeCard from '../home/components /ChallengeCard';

const ChallengesScreen = ({ navigation }) => {
    const { challenge, challengeLoading, getStatusLabel, canEnrollNow } = useChallenge();
    console.log('ChallengesScreen challengepppppppppppp', challenge);

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
                data={[challenge]}
                renderItem={({ item }) => (
                    <ChallengeCard
                        loading={challengeLoading}
                        prizePoolUsd={challenge?.prizePoolUsd}
                        challengeTitle={challenge?.title}
                        shortDescriptionSegments={challenge?.shortDescriptionSegments}
                        enrollmentStartAt={challenge?.enrollmentStartAt?.toDate()}
                        challengeStartAt={challenge?.challengeStartAt?.toDate()}
                        challengeEndAt={challenge?.challengeEndAt?.toDate()}
                        getStatusLabel={getStatusLabel}
                        canEnrollNow={canEnrollNow}
                    />
                )}
                keyExtractor={item => item?.id}
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
