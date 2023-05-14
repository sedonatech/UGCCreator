import { useState } from 'react';
import { Alert } from 'react-native';

const useAITools = () => {
    const [brandName, setBrandName] = useState();

    const [productName, setProductName] = useState();

    const [productDescription, setProductDescription] = useState();

    const [valueProposition, setValueProposition] = useState();

    const [persona, setPersona] = useState();

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [responseMessage, setResponseMessage] = useState();

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
            const prompt = `Create a UGC script for a ${data.productName} for ${data.brandName} that is ${data.productDescription} and ${data.valueProposition} and is in the ${data.selectedCategories} category`;

            const responseData = await fetch('http://localhost:3000/ugcCreatorAppApi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const response = await responseData.json();

            setResponseMessage(response?.message?.message?.content);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert('Something went wrong');
        }
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
    };
};

export default useAITools;
