import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, View} from 'react-native';
import TemplateText from '../TemplateText';
import {BLACK, BLACK_30, BLACK_50, WHITE} from '../../theme/Colors';
import TemplateTouchable from '../TemplateTouchable';
import TemplateBox from '../TemplateBox';
const ContentCard = ({
  image,
  title,
  subtitle,
  callout,
  buttonTitle,
  isLast,
  slideInTime,
}) => {
  return (
    <>
      <TemplateBox slideInTime={slideInTime} slideIn style={styles.contentCard}>
        <View style={styles.imageContainer}>
          {!!image && <Image source={image} style={styles.image} />}
          <View>
            <TemplateText startCase color={BLACK} size={16}>
              {title}
            </TemplateText>
            <TemplateText startCase color={BLACK_50} size={12}>
              {subtitle}
            </TemplateText>
          </View>
        </View>

        {buttonTitle ? (
          <TemplateTouchable style={styles.addButton}>
            <TemplateText color={WHITE} size={12}>
              {buttonTitle}
            </TemplateText>
          </TemplateTouchable>
        ) : (
          <TemplateText color={BLACK_50} size={12}>
            {callout}
          </TemplateText>
        )}
      </TemplateBox>
      {!isLast && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 16,
  },
  addButton: {
    backgroundColor: BLACK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  divider: {
    height: 0.4,
    backgroundColor: BLACK_30,
    marginHorizontal: 16,
  },
});

ContentCard.propTypes = {
  image: PropTypes.object || PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  callout: PropTypes.string,
  buttonTitle: PropTypes.string,
  isLast: PropTypes.bool,
  slideInTime: PropTypes.number,
};

ContentCard.defaultProps = {
  image: null,
  title: '',
  subtitle: '',
  callout: '',
  buttonTitle: '',
  isLast: false,
  slideInTime: 0,
};

export default ContentCard;
