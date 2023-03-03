import React from 'react';
import CPicker from 'react-native-currency-picker';
import PropTypes from 'prop-types';

import TemplateBox from './TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../theme/Layout';
import { GREY_SECONDARY } from '../theme/Colors';

const CurrencyPicker = ({ onSelectCurrency, value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let currencyPickerRef;
    return (
        <TemplateBox
            height={60}
            borderWidth={1}
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            borderColor={GREY_SECONDARY}
            borderRadius={10}
            pAll={20}
            selfCenter
        >
            <CPicker
                currencyPickerRef={(ref) => { currencyPickerRef = ref; }}
                enable
                darkMode={false}
                currencyCode={value?.code}
                showFlag
                showCurrencyName
                showCurrencyCode
                onSelectCurrency={(data) => onSelectCurrency({ code: data.code, symbol: data.symbol })}
                onOpen={() => { console.log('Open'); }}
                onClose={() => { console.log('Close'); }}
                showNativeSymbol
                showSymbol={false}
                containerStyle={{
                    container: {},
                    flagWidth: 25,
                    currencyCodeStyle: {},
                    currencyNameStyle: {},
                    symbolStyle: {},
                    symbolNativeStyle: {},
                }}
                modalStyle={{
                    container: {},
                    searchStyle: {},
                    tileStyle: {},
                    itemStyle: {
                        itemContainer: {},
                        flagWidth: 25,
                        currencyCodeStyle: {},
                        currencyNameStyle: {},
                        symbolStyle: {},
                        symbolNativeStyle: {},
                    },
                }}
                title="Currency"
                searchPlaceholder="Search"
                showCloseButton
                showModalTitle
            />
        </TemplateBox>
    );
};

CurrencyPicker.propTypes = {
    onSelectCurrency: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default CurrencyPicker;
