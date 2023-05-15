import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAITools = (toolType = 'scripts') => {
    const [brandName, setBrandName] = useState();

    const [productName, setProductName] = useState();

    const [productDescription, setProductDescription] = useState();

    const [valueProposition, setValueProposition] = useState();

    const [persona, setPersona] = useState();

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [responseMessage, setResponseMessage] = useState();

    const [contentGenerationResultsHistory, setContentGenerationResultsHistory] = useState([]);

    const [loadingHistory, setLoadingHistory] = useState(false);

    const onCategoriesPress = (value) => {
        if (selectedCategories.includes(value)) {
            setSelectedCategories(selectedCategories.filter((filter) => filter !== value));
        } else {
            setSelectedCategories([...selectedCategories, value]);
        }
    };

    const handleSaveAndSubmit = async () => {
        try {
            setLoading(true);
            if (!brandName || !productName || !productDescription || !selectedCategories) {
                Alert.alert('Please fill all the required  fields');
                setLoading(false);
                return;
            }
            const data = {
                brandName,
                productName,
                productDescription,
                valueProposition,
                selectedCategories,
            };
            const scriptPrompt = `Create a UGC script for a ${data.productName} for ${data.brandName} that is ${data.productDescription} and ${data.valueProposition} and is in the ${data.selectedCategories} category`;

            const hooksPrompt = `Create 5 UGC hooks for a ${data.productName} for ${data.brandName} that is ${data.productDescription} and ${data.valueProposition} and is in the ${data.selectedCategories} category`;

            const contentSuggestionsPrompt = `Create 5 UGC content suggestions for a ${data.productName} for ${data.brandName} that is ${data.productDescription} and ${data.valueProposition} and is in the ${data.selectedCategories} category`;

            // eslint-disable-next-line no-nested-ternary
            const prompt = toolType === 'scripts' ? scriptPrompt : toolType === 'hooks' ? hooksPrompt : contentSuggestionsPrompt;

            const responseData = await fetch('http://localhost:3000/ugcCreatorAppApi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const response = await responseData.json();

            setResponseMessage(response?.message?.message?.content);

            const contentGenerationResultsFromLocalStorage = await AsyncStorage.getItem('contentGenerationResults');
            const contentGenerationResultsHistoryParsed = JSON.parse(contentGenerationResultsFromLocalStorage) || [];

            await AsyncStorage.setItem('contentGenerationResults', JSON.stringify([...contentGenerationResultsHistoryParsed, {
                type: toolType,
                result: response?.message?.message?.content,
            }]));

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert('Something went wrong');
        }
    };

    const fetchContentGenerationResultsHistory = async () => {
        try {
            setLoadingHistory(true);
            const contentGenerationResults = await AsyncStorage.getItem('contentGenerationResults');

            if (contentGenerationResults) {
                setContentGenerationResultsHistory(JSON.parse(contentGenerationResults));
            }
        } catch (error) {
            console.log(error);
        }
        setLoadingHistory(false);
    };

    return {
        brandName,
        setBrandName,
        productName,
        setProductName,
        productDescription,
        setProductDescription,
        valueProposition,
        setValueProposition,
        selectedCategories,
        setSelectedCategories,
        persona,
        setPersona,
        onCategoriesPress,
        handleSaveAndSubmit,
        loading,
        responseMessage,
        contentGenerationResultsHistory,
        fetchContentGenerationResultsHistory,
        loadingHistory,
    };
};

export default useAITools;
