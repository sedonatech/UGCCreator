/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
import { useState, useEffect, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai-edge';
import 'react-native-url-polyfill/auto';
import firestore from '@react-native-firebase/firestore';
// New imports for OAuth, Cloud Functions and notifications
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';

// Added imports for Firebase + Google Sign-In
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useFeatureFlags from '../featureFlags/useFeatureFlags';
import useAuthContext from '../auth/useAuthContext';

const OPENAI_API_KEY = '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';
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const ANDROID_CLIENT_ID = '1029021461255-6bthdkpsm4a4t0r0ne5hv4g5k32pnt6u.apps.googleusercontent.com';
const IOS_CLIENT_ID = '1029021461255-ftuvghcsmo4rovba732hl96816972ggj.apps.googleusercontent.com';
const REDIRECT_SCHEME = 'com.ugccreatorapp';
const REDIRECT_PATH = 'oauth2redirect/google';
const WEB_CLIENT_ID = '1029021461255-0kci8gogq2vip2qnhjhacrrgdbpjvgds.apps.googleusercontent.com';

const useAITools = (toolType = 'scripts') => {
    // --- Existing state ---
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

    // --- New state for Outreach Agent ---
    const [emailTokens, setEmailTokens] = useState(null);
    const [leads, setLeads] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [sending, setSending] = useState(false);
    const [replies, setReplies] = useState([]);
    const [tracking, setTracking] = useState(false);

    const onCategoriesPress = (value) => {
        setSelectedCategories((cats) => (cats.includes(value)
            ? cats.filter((c) => c !== value)
            : [...cats, value]));
    };

    const { auth: profileAuth } = useAuthContext();
    const userProfile = profileAuth?.profile || {};
    const { recommendedBrands } = useFeatureFlags();

    const allBrands = useMemo(() => {
        if (!recommendedBrands?.recommendation) {
            return [];
        }
        return recommendedBrands?.recommendation?.flatMap((category) => category.data.map((brand) => ({
            name: brand.name,
            description: brand.description,
            email: brand.email,
            url: brand.url,
        }))) || [];
    }, [recommendedBrands]);

    // --- 0. Authenticate email via Firebase + Google Sign-In ---
    const authenticateEmail = async () => {
        try {
            // 1) Configure Google Sign-In
            GoogleSignin.configure({
                webClientId: WEB_CLIENT_ID,
                iosClientId: IOS_CLIENT_ID,
                offlineAccess: true, // we need serverAuthCode
                scopes: [
                    'openid',
                    'profile',
                    'email',
                    'https://www.googleapis.com/auth/gmail.send',
                    'https://www.googleapis.com/auth/gmail.readonly',
                ],
            });

            // 2) Ensure services are available
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // 3) Sign in & get basic info + serverAuthCode
            const userInfo = await GoogleSignin.signIn();

            // 4) Get fresh tokens (idToken & accessToken)
            const { idToken, accessToken } = await GoogleSignin.getTokens();

            // 5) Sign into Firebase with just the idToken
            const credential = auth.GoogleAuthProvider.credential(idToken);
            // await auth().signInWithCredential(credential);

            // 6) Build an object with only the defined keys
            const gmailAuthPayload = {};
            if (idToken) gmailAuthPayload.idToken = idToken;
            if (accessToken) gmailAuthPayload.accessToken = accessToken;
            if (userInfo.data?.serverAuthCode) gmailAuthPayload.serverAuthCode = userInfo.data.serverAuthCode;

            // 7) Persist to Firestore
            const { uid } = auth().currentUser;
            await firestore().collection('users').doc(uid).set(
                { gmailAuth: gmailAuthPayload },
                { merge: true },
            );

            // 8) Update local state if you keep it
            setEmailTokens({
                idToken,
                accessToken,
                serverAuthCode: userInfo.serverAuthCode,
            });
        } catch (err) {
            console.error('Email Authentication Failed', err);
            Alert.alert('Email Authentication Failed', err.message);
        }
    };

    // --- 1. Content generation (scripts/hooks/suggestions) ---
    const handleSaveAndSubmit = async () => {
        try {
            setLoading(true);
            if (!brandName || !productName || !productDescription || !selectedCategories.length) {
                Alert.alert('Please fill all the required fields');
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
            const prompt = toolType === 'scripts'
                ? scriptPrompt
                : toolType === 'hooks'
                    ? hooksPrompt
                    : contentSuggestionsPrompt;

            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                stream: false,
                messages: [
                    {
                        role: 'system',
                        content: `You are a great UGC creator working for ${data.brandName}.`,
                    },
                    { role: 'user', content: prompt },
                ],
            });

            const response = await completion.json();
            const text = response.choices[0].message.content;
            setResponseMessage(text);

            const raw = await AsyncStorage.getItem('contentGenerationResults');
            const hist = raw ? JSON.parse(raw) : [];
            await AsyncStorage.setItem(
                'contentGenerationResults',
                JSON.stringify([...hist, { type: toolType, result: text }]),
            );
            setLoading(false);
        } catch (error) {
            console.error('SCRIPTS GENERATOR ERROR:', error);
            setLoading(false);
            Alert.alert('Something went wrong');
        }
    };

    // --- fetchContentGenerationResultsHistory (unchanged) ---
    const fetchContentGenerationResultsHistory = async () => {
        try {
            setLoadingHistory(true);
            const raw = await AsyncStorage.getItem('contentGenerationResults');
            if (raw) {
                setContentGenerationResultsHistory(JSON.parse(raw));
            }
        } catch (error) {
            console.error('SCRIPTS GENERATOR HISTORY ERROR', error);
        }
        setLoadingHistory(false);
    };

    // --- 2. scanLeads using OpenAI to pick top 20 verified + 20 new ---
    const scanLeads = async () => {
        setScanning(true);
        try {
            // 1) Build a plain‐text catalog
            const entries = allBrands
                .map((b, i) => `- ${i + 1}. ${b.name} | ${b.website}${b.email ? ` | ${b.email}` : ''}`)
                .join('\n');

            // 2) Simplified prompt to force exactly 40 JSON items
            const prompt = `
From the list below, select the top 20 most relevant and verified brands, then add 20 new verified brand leads, for a total of exactly 40 items. Return ONLY a JSON array of 40 objects. Each object must have these keys:
"No.", "Brand Name", "Instagram", "Site", "Mail Address", "Caption".

Creator profile:
${userProfile}

Catalog:
${entries}
`;

            // 3) Call the OpenAI API
            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                stream: false,
                messages: [
                    { role: 'system', content: 'You are a precise lead-generation assistant.' },
                    { role: 'user', content: prompt },
                ],
            });
            const res = await completion.json();
            let raw = res.choices?.[0]?.message?.content ?? '';
            raw = raw.trim();

            console.log('🚀 ~ scanLeads raw response:', raw);

            // 4) Strip any code fences/backticks
            raw = raw.replace(/```/g, '').trim();

            // 5) Extract JSON array between the first '[' and the matching ']'
            const start = raw.indexOf('[');
            if (start === -1) throw new Error('No JSON array found in GPT response');
            let depth = 0;
            let end = -1;
            for (let i = start; i < raw.length; i++) {
                if (raw[i] === '[') depth++;
                else if (raw[i] === ']') {
                    depth--;
                    if (depth === 0) {
                        end = i;
                        break;
                    }
                }
            }
            if (end === -1) throw new Error('No JSON array found in GPT response');

            const jsonString = raw.slice(start, end + 1);

            // 6) Parse and set leads
            const parsedLeads = JSON.parse(jsonString);
            console.log('🚀 ~ scanLeads ~ parsedLeads:', parsedLeads);
            setLeads(parsedLeads);
        } catch (err) {
            console.error('scanLeads error:', err);
            Alert.alert('Failed to scan leads', err.message);
        } finally {
            setScanning(false);
        }
    };

    // --- 3. draftMessages via OpenAI for selected leads ---
    const draftMessages = async () => {
        if (!leads.length) {
            Alert.alert('No leads available to draft messages for.');
            return;
        }
        try {
            setLoading(true);
            const prompt = `
Generate a personalized outreach email for each brand. Respond with JSON:
[{"No.":"1","Brand Name":"…","Draft":"…"},…]
Use persona: ${persona || 'neutral'}.
`;
            const completion = await openai.createChatCompletion({
                model: 'gpt-4',
                stream: false,
                messages: [
                    { role: 'system', content: 'You are an expert outreach assistant.' },
                    { role: 'user', content: prompt },
                ],
            });
            const res = await completion.json();
            setDrafts(JSON.parse(res.choices[0].message.content.trim()));
        } catch (err) {
            console.error('draftMessages error:', err);
            Alert.alert('Failed to generate drafts', err.message);
        }
        setLoading(false);
    };

    // --- 4. sendOutreach via Cloud Functions (email or web form) ---
    const sendOutreach = async (leadNo) => {
        const lead = leads.find((l) => l['No.'] === String(leadNo));
        if (!lead) return Alert.alert('Lead not found');
        const draft = drafts.find((d) => d['No.'] === String(leadNo));
        if (!draft) return Alert.alert('Draft not available');
        try {
            setSending(true);
            const fn = lead['Mail Address']
                ? functions().httpsCallable('sendOutreachEmail')
                : functions().httpsCallable('submitWebForm');
            await fn({ to: lead['Mail Address'], site: lead.Site, body: draft.Draft });
        } catch (err) {
            console.error('sendOutreach error:', err);
            Alert.alert('Failed to send outreach', err.message);
        }
        setSending(false);
    };

    // --- 5. trackReplies via Cloud Function ---
    const trackReplies = async () => {
        try {
            setTracking(true);
            const { data } = await functions().httpsCallable('trackReplies')();
            setReplies(data.replies);
        } catch (err) {
            console.error('trackReplies error:', err);
        }
        setTracking(false);
    };

    // --- 6. Daily notifications via useEffect ---
    useEffect(() => {
        messaging().requestPermission();
        const interval = setInterval(trackReplies, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

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
        emailTokens,
        authenticateEmail,
        leads,
        scanning,
        scanLeads,
        drafts,
        draftMessages,
        sending,
        sendOutreach,
        replies,
        tracking,
        trackReplies,
    };
};

export default useAITools;
