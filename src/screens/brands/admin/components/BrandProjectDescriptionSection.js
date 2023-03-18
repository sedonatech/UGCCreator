import moment from 'moment/moment';
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import { BLACK } from '../../../../theme/Colors';
import DescriptionRange from '../../../app/explore/components/DescriptionRange';
import DescriptionRow from '../../../app/explore/components/DescriptionRow';
import {
    ageFilters,
    countryFilters,
    deliveryFormatFilters, genderFilters, languageFilters,
    projectDurationFilters,
    projectFilters, projectTypeFilters,
} from '../../../../consts/AppFilters/ProjectFilters';
import TemplateBox from '../../../../components/TemplateBox';

const BrandProjectDescriptionSection = ({
    selectedProject,
}) => (
    <TemplateBox ph={WRAPPER_MARGIN}>
        <TemplateText
            style={styles.title}
            bold
            size={18}
            color={BLACK}
        >
            Description
        </TemplateText>
        <TemplateText
            color={BLACK}
            size={16}
            lineHeight={22}
        >
            {selectedProject?.description}
        </TemplateText>
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Timeline
        </TemplateText>
        <DescriptionRange
            icon="timer-outline"
            maxSubtitle="Start Date"
            maxTitle={moment(selectedProject?.startDate).format('DD MMM YYYY')}
            minSubtitle="End Date"
            minTitle={moment(selectedProject?.endDate).format('DD MMM YYYY')}
        />
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Price Range
        </TemplateText>
        <DescriptionRange
            icon="wallet-outline"
            maxSubtitle="Maximum Budget"
            maxTitle={`${selectedProject?.priceRange?.max} ${selectedProject?.currency?.symbol}`}
            minSubtitle="Minimum Budget"
            minTitle={`${selectedProject?.priceRange?.min} ${selectedProject?.currency?.symbol}`}
        />
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Content Delivery Format
        </TemplateText>
        {selectedProject?.deliveryFormat?.map((format) => (
            <DescriptionRow
                key={deliveryFormatFilters?.find(({ value }) => value === format)?.value}
                title={deliveryFormatFilters?.find(({ value }) => value === format)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Project Duration
        </TemplateText>
        {selectedProject?.duration?.map((duration) => (
            <DescriptionRow
                key={projectDurationFilters?.find(({ value }) => value === duration)?.value}
                title={projectDurationFilters
                    ?.find(({ value }) => value === duration)
                    ?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Categories
        </TemplateText>
        {selectedProject?.categories?.map((category) => (
            <DescriptionRow
                key={projectFilters?.find(({ value }) => value === category)?.value}
                title={projectFilters?.find(({ value }) => value === category)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Location
        </TemplateText>
        {selectedProject?.countries?.map((country) => (
            <DescriptionRow
                key={countryFilters?.find(({ value }) => value === country)?.value}
                title={countryFilters?.find(({ value }) => value === country)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Genders
        </TemplateText>
        {selectedProject?.gender?.map((gender) => (
            <DescriptionRow
                key={genderFilters?.find(({ value }) => value === gender)?.value}
                title={genderFilters?.find(({ value }) => value === gender)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Content Languages
        </TemplateText>
        {selectedProject?.languages?.map((language) => (
            <DescriptionRow
                key={languageFilters?.find(({ value }) => value === language)?.value}
                title={languageFilters?.find(({ value }) => value === language)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Age Ranges
        </TemplateText>
        {selectedProject?.ageRange?.map((range) => (
            <DescriptionRow
                key={ageFilters?.find(({ value }) => value === range)?.value}
                title={ageFilters?.find(({ value }) => value === range)?.name}
            />
        ))}
        <TemplateText
            style={styles.title}
            bold
            size={20}
            color={BLACK}
        >
            Project Type
        </TemplateText>
        {selectedProject?.projectType?.map((type) => (
            <DescriptionRow
                key={projectTypeFilters?.find(({ value }) => value === type)?.value}
                title={projectTypeFilters?.find(({ value }) => value === type)?.name}
            />
        ))}
        <TemplateBox height={100} />
    </TemplateBox>
);

BrandProjectDescriptionSection.propTypes = {
    selectedProject: PropTypes.shape({
        description: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        priceRange: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number,
        }),
        currency: PropTypes.shape({
            symbol: PropTypes.string,
        }),
        deliveryFormat: PropTypes.arrayOf(PropTypes.string),
        duration: PropTypes.arrayOf(PropTypes.string),
        categories: PropTypes.arrayOf(PropTypes.string),
        projectType: PropTypes.arrayOf(PropTypes.string),
        countries: PropTypes.arrayOf(PropTypes.string),
        gender: PropTypes.arrayOf(PropTypes.string),
        languages: PropTypes.arrayOf(PropTypes.string),
        ageRange: PropTypes.arrayOf(PropTypes.string),
    }),
};

BrandProjectDescriptionSection.defaultProps = {
    selectedProject: {
        description: '',
        startDate: '',
        endDate: '',
        priceRange: {
            min: 0,
            max: 0,
        },
        currency: {
            symbol: '',
        },
        deliveryFormat: [],
        duration: [],
        categories: [],
        projectType: [],
        countries: [],
        gender: [],
        languages: [],
        ageRange: [],
    },
};

const styles = StyleSheet.create({
    title: {
        marginBottom: 10,
        marginTop: WRAPPER_MARGIN * 2,
    },
});
export default BrandProjectDescriptionSection;
