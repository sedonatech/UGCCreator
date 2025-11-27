import React, { useState } from 'react';
//@ts-ignore
import challengeBackground from '../../../../assets/images/challenge-background.jpg';
import { Image, ScrollView } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLACK_SECONDARY,
    DARK_GREY,
    METAL,
    WHITE_30,
    WHITE_40,
} from '../../../theme/Colors';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import ToggleTab from '../../../components/ToggleTab';
import Button from '../../../components/Button';

const TOGGLE_TABS = ['Brief', 'Rules', 'Prizes'];

const ChallengeDetailsScreen = () => {
    const [activeTab, setActiveTab] = useState(TOGGLE_TABS[0]);
    return (
        <ScrollView>
            <TemplateBox width={SCREEN_WIDTH} height={260}>
                <TemplateBox absolute top={0} left={0} right={0} overflow="hidden" height={260}>
                    <Image source={challengeBackground} style={{ width: '100%', height: '100%' }} />
                </TemplateBox>
                <TemplateBox absolute bottom={30} left={20}>
                    <TemplateText bold size={22} mv={10}>
                        3 WEEK VIDEO CHALLENGE
                    </TemplateText>
                    <TemplateBox row>
                        <TemplateBox
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={WHITE_40}
                            ph={16}
                            pv={6}
                            borderRadius={26}
                            borderWidth={1}
                            borderColor={BLACK_20}
                            row
                            mr={10}
                        >
                            <TemplateText size={14} medium color={BLACK_SECONDARY}>
                                Enrollment Open
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={WHITE_40}
                            ph={16}
                            pv={6}
                            borderRadius={26}
                            borderWidth={1}
                            borderColor={BLACK_20}
                            row
                            mr={10}
                        >
                            <TemplateText size={14} medium color={BLACK_SECONDARY}>
                                Ends in 30 days
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox
                row
                mv={16}
                mh={20}
                alignItems="center"
                justifyContent="space-between"
                width={SCREEN_WIDTH - 40}
            >
                <TemplateBox
                    backgroundColor={BLACK_10}
                    borderRadius={16}
                    pAll={18}
                    alignItems="center"
                    justifyContent="center"
                    width={(SCREEN_WIDTH - 60) / 2}
                >
                    <TemplateBox row alignItems="center" mb={6}>
                        <DynamicIcon name="Trophy" size={16} />
                        <TemplateText color={DARK_GREY} size={16} ml={6}>
                            Price Pool
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText semiBold size={20}>
                        Up to 500$
                    </TemplateText>
                </TemplateBox>

                <TemplateBox
                    backgroundColor={BLACK_10}
                    borderRadius={16}
                    pAll={18}
                    alignItems="center"
                    justifyContent="center"
                    width={(SCREEN_WIDTH - 60) / 2}
                >
                    <TemplateBox row alignItems="center" mb={6}>
                        <DynamicIcon name="People" size={16} />
                        <TemplateText color={DARK_GREY} size={16} ml={6}>
                            Participants
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText semiBold size={20}>
                        1200+
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <ToggleTab activeTab={activeTab} tabs={TOGGLE_TABS} onPress={setActiveTab} />
            {activeTab === TOGGLE_TABS[0] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={80}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        The mission
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL}>
                        Create short TikTok videos that showcase UGCCreatorApp, drive installs through your link, and
                        prove you can move real numbers as a ugc creator.
                    </TemplateText>

                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps mt={20}>
                        How to participate
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            1. Create:
                        </TemplateText>{' '}
                        Record short TikTok videos that clearly show or talk about UGCCreatorApp, what it does for
                        creators, and why it is useful.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            2. Post:
                        </TemplateText>{' '}
                        Publish your videos on TikTok and add the UGCCreatorApp store link in your caption or bio so
                        people can tap through.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            3. Track:
                        </TemplateText>{' '}
                        Monitor your metrics for each video. At minimum you track views, likes, comments, shares, saves,
                        and link clicks.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            4. Update weekly:
                        </TemplateText>{' '}
                        Once a week, open the challenge in the app, pick each video, paste the TikTok URL, and update
                        the latest numbers for all required metrics.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            5. Final Upload:
                        </TemplateText>{' '}
                        On the final submission day, you enter your latest metrics one last time for each video.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            6. Winner selection:
                        </TemplateText>{' '}
                        The brand reviews your links, metrics, and screenshots, verifies the numbers, and compares all
                        creators. The single video with the highest performance based on the challenge rules is picked
                        as the winner, with additional prizes for the top ten overall.
                    </TemplateText>
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[1] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={80}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        Rules of the challenge
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            1.
                        </TemplateText>{' '}
                        You must enroll inside UGCCreatorApp during the enrollment week, add your TikTok handle, and
                        have an active account.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            2.
                        </TemplateText>{' '}
                        Only TikTok videos count. Each video must feature UGCCreatorApp and include the app download
                        link in your caption or bio.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            3.
                        </TemplateText>{' '}
                        You can post multiple videos during the 3 week challenge, but only videos posted within the
                        official dates and added in the app with a valid TikTok URL are eligible.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            4.
                        </TemplateText>{' '}
                        For each submitted video you track views, likes, comments, shares, saves, and, if available,
                        link clicks. You update these numbers in the app at least once per week.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            5.
                        </TemplateText>{' '}
                        On the final submission day you choose which videos you submit, enter your latest metrics, and
                        upload clear screenshots as proof. After you submit, you cannot edit anything.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            6.
                        </TemplateText>{' '}
                        Winners are chosen based on the performance of individual videos, using the submitted and
                        verified metrics. The brand selects the top five videos and its decision is final.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            7.
                        </TemplateText>{' '}
                        The brand can request extra proof, exclude entries if numbers do not match TikTok, and
                        disqualify creators for fake engagement or misleading data.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            6.
                        </TemplateText>{' '}
                        Thats not all, you keep rights to your content, you can later request a reasonable usage rights
                        offer if your videos gain traction so don't take them down. The brand may send paid usage rights
                        offers for high performing entries.
                    </TemplateText>
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[2] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={100}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        Prizes & rewards
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * Grand Prize:
                        </TemplateText>{' '}
                        Cash prizes up to 300 USD shared across the top 10 creators.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * Runners Up:
                        </TemplateText>{' '}
                        Rewards scale by position, from first place down to tenth.
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * All Participants:
                        </TemplateText>{' '}
                        High performing videos can earn extra: you can request a separate usage rights fee from the
                        brand after the challenge even if you don't win.
                    </TemplateText>
                </TemplateBox>
            )}
            <TemplateBox
                absolute
                bottom={20}
                selfCenter
                backgroundColor={WHITE_30}
                width={SCREEN_WIDTH}
                alignItems="center"
                pt={30}
            >
                <Button title={'Enroll Now'} height={50} width={SCREEN_WIDTH - 40} color={BLACK} />
            </TemplateBox>
        </ScrollView>
    );
};
export default ChallengeDetailsScreen;
