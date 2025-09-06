import React, { useState } from "react";
import { Text, Dimensions, StyleSheet } from "react-native";
import SampleWorkModal from "../../../../components/modals/SampleWorkModal";
import { getMySamples, SampleWork } from "../../../../lib/sampleWorks";
import { BLACK, DARK_GREY, GREY, GREY_SECONDARY } from "../../../../theme/Colors";
import useAuthContext from "../../../../hooks/auth/useAuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from "../../../../theme/Layout";
import TemplateBox from "../../../../components/TemplateBox";
import TemplateText from "../../../../components/TemplateText";
import TemplateCarousel from "../../../../components/carousels/TemplateCarousel";
import ProjectCard from "../../home/components /ProjectCard";
import { SAMPLE_DETAILS_SCREEN } from "../../../../navigation/ScreenNames";
import { hp } from "../../../../Utils/getResponsiveSize";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH / 2) - 28;
const CARD_HEIGHT = 240;
const CARD_SPACING = 16;

export default function PortfolioCarousel({ creatorId }) {
  const { auth } = useAuthContext()
  const [items, setItems] = useState<SampleWork[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<SampleWork | null>(null);
  const uid = auth?.profile?.id;

  const isOwner = (!!creatorId && creatorId === uid) || !creatorId

  const navigation = useNavigation()

  async function refresh() {
    try {
      if (!uid) return;
      const all = await getMySamples(creatorId || uid);
      const visible = isOwner ? all : all?.filter((s) => !!s.isFeatured);
      setItems(visible);
    }
    catch (e) {
      console.log(e)
    }
  }

  useFocusEffect((
    React.useCallback(() => {
      refresh();
    }, [uid])
  ))

  const canAddMore = isOwner && items.length < 3;

  const titleText = isOwner ? "Your Sample Work" : "Creator Showcase";
  const subtitleText = isOwner
    ? "Add sample works to your profile with a chance of being featured."
    : "Featured sample works from this creator.";

  if(items?.length < 1) return null

  return (
    <TemplateBox flex>
      <TemplateBox row alignItems="center" spaceBetween ph={WRAPPER_MARGIN} mb={8} width={WRAPPED_SCREEN_WIDTH}>
        <TemplateText size={18} bold mr={8}>{titleText}</TemplateText>
        {isOwner && <Text style={{ color: "#9ca3af" }}>{items.length}/3</Text>}
      </TemplateBox>
      <TemplateText size={13} color={BLACK} style={styles.subtitle}>
        {subtitleText}
      </TemplateText>

      <TemplateCarousel
        data={[...items, ...(canAddMore ? [{ __add: true } as any] : [])]}
        renderItem={({ item }) => {
          if ((item as any).__add && isOwner) {
            return (
              <TemplateBox
                onPress={() => {
                  setEditItem(null);
                  setOpen(true);
                }}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderWidth={0.8}
                borderColor={GREY_SECONDARY}
                borderRadius={16}
                alignItems='center'
                justifyContent='center'
              >
                <TemplateText
                  color={BLACK}
                  bold
                  size={hp(14)}
                >
                  + Add Sample
                </TemplateText>
                <TemplateText mt={6} color={DARK_GREY} size={hp(12)}>
                  Max 3 items
                </TemplateText>
              </TemplateBox>
            );
          }

          return (
            <ProjectCard
              key={item?.id}
              image={!!item?.coverUrl && { uri: item?.coverUrl }}
              title={item?.title}
              shortDescription={item?.description}
              onPress={() => navigation.navigate(SAMPLE_DETAILS_SCREEN, {
                id: item?.id,
              })}
              style={styles.card}
            />
          )
        }}
        keyExtractor={(it, idx) => (it.__add ? "add" : (it.id as string)) + idx}
        contentContainerStyle={styles.cardCarousel}
        snapToInterval={(SCREEN_WIDTH / 2) - 28}
      />

      {isOwner && <SampleWorkModal
        open={open}
        onClose={() => {
          setOpen(false);
          refresh();
        }}
        initial={editItem || undefined}
      />
      }
    </TemplateBox>
  )


}


const styles = StyleSheet.create({
  card: {
    marginRight: 15,
  },
  cardCarousel: {
    paddingHorizontal: WRAPPER_MARGIN,
  },
  subtitle: {
    marginLeft: WRAPPER_MARGIN,
    marginBottom: 10,
  },
})

