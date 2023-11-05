import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from "openai-edge"
import "react-native-url-polyfill/auto"; 

const OPENAI_API_KEY = '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';

// Create an OpenAI API client (that's edge friendly!)
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                stream: false,
                messages: [
                {
                    role: "system",
                    content: `You are a great UGC creator and you are working for a brand ${data.brandName} that ${data.productDescription}. You are tasked with creating a script for a UGC video. `
                },
                {
                    role: "user",
                    content: prompt
                },
                ],
            });
        
            const response = await completion.json();
  
            setResponseMessage(response?.choices[0]?.message?.content);

            const contentGenerationResultsFromLocalStorage = await AsyncStorage.getItem('contentGenerationResults');

            const contentGenerationResultsHistoryParsed = await JSON.parse(contentGenerationResultsFromLocalStorage)
                || [];

            await AsyncStorage.setItem('contentGenerationResults', JSON.stringify([...contentGenerationResultsHistoryParsed, {
                type: toolType,
                result: response?.message?.message?.content,
            }]));

            setLoading(false);
        } catch (error) {
            console.log('SCRIPTS GENERATOR ERROR: ', error);
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
            console.log('SCRIPTS GENERATOR HISTORY ERROR', error);
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
