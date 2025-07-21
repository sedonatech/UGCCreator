import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai-edge';
import 'react-native-url-polyfill/auto';
// New: Firestore import for brand catalog
import firestore from '@react-native-firebase/firestore';

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
                        role: 'system',
                        content: `You are a great UGC creator and you are working for a brand ${data.brandName} that ${data.productDescription}. You are tasked with creating a script for a UGC video. `,
                    },
                    {
                        role: 'user',
                        content: prompt,
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

    // --- New: state & function for AI-powered lead scanning ---
    const [leads, setLeads] = useState([]);
    const [scanning, setScanning] = useState(false);

    const scanLeads = async () => {
        setScanning(true);
        try {
            // 1. Load full brand catalog
            const snapshot = await firestore().collection('brands').get();
            const allBrands = snapshot.docs.map((doc) => doc.data());

            // 2. Build prompt context
            const userPrefs = `Creator prefers categories: ${selectedCategories.join(', ')}.`;
            const brandEntries = allBrands
                .map(
                    (b, i) => `- ${i + 1}. ${b.name} | ${b.website}${b.email ? ` | ${b.email}` : ''}`,
                )
                .join('\n');

            // 3. Ask OpenAI to filter & verify
            const prompt = `
You are a smart lead-generation assistant. Select the top 20 most relevant AND VERIFIED brands for a content creator.
Creator profile:
${userPrefs}

Here is the catalog of brands (each line: index. name | website | optional email):
${brandEntries}

Requirements:
1. Only include brands whose website URL returns a valid page (no 404).
2. Only include legitimate corporate or official emails—no random aliases.
3. For each brand, include its Instagram handle (if known).
4. Provide a one-line caption describing each brand’s USP.

Return your answer as a JSON array of up to 20 objects, exactly in this format:
[
  {
    "No.": "1",
    "Brand Name": "Brand Name Here",
    "Instagram": "@brandhandle",
    "Site": "https://brand-website.com",
    "Mail Address": "contact@brand-website.com",
    "Caption": "Short description of the brand’s value proposition."
  },
  ...
]

Do not include any additional text—only valid JSON.
`;

            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                stream: false,
                messages: [
                    { role: 'system', content: 'You are a helpful lead-generation agent.' },
                    { role: 'user', content: prompt },
                ],
            });

            const response = await completion.json();
            const parsedLeads = JSON.parse(response?.choices[0]?.message?.content.trim());
            setLeads(parsedLeads);
        } catch (err) {
            console.error('scanLeads error:', err);
            Alert.alert('Failed to scan leads', err.message);
        }
        setScanning(false);
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
        // --- New exposed state & action ---
        leads,
        scanning,
        scanLeads,
    };
};

export default useAITools;
