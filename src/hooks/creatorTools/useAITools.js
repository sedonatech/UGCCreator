import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { useTranslation } from 'react-i18next';

import { GROQ_API_KEY } from '../../config/aiConfig';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL_PREFERENCES = ['llama-3.1-8b-instant', 'llama3-8b-8192'];

const AI_HISTORY_STORAGE_KEY = 'contentGenerationResults';
const AI_CACHE_STORAGE_KEY = 'contentGenerationResultsCache';
const AI_QUOTA_STORAGE_KEY = 'contentGenerationGroqQuota';

const REQUEST_TIMEOUT_MS = 20000;
const REQUEST_COOLDOWN_MS = 12000;
const DAILY_REQUEST_LIMIT = 8;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const MAX_CACHE_ENTRIES = 15;
const MAX_HISTORY_ITEMS = 20;

const TOOL_SETTINGS = {
    scripts: {
        maxTokens: 220,
        taskInstruction: 'Write 1 short UGC script with sections labeled Hook, Body, and CTA. Keep it under 170 words.',
    },
    hooks: {
        maxTokens: 120,
        taskInstruction: 'Return exactly 5 punchy hook lines. Each line must be 12 words or fewer.',
    },
    default: {
        maxTokens: 140,
        taskInstruction: 'Return exactly 5 concise UGC content ideas. Each line should be one sentence.',
    },
};

const safeJsonParse = value => {
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
};

const trimText = value => (typeof value === 'string' ? value.trim() : '');

const getToolSettings = toolType => TOOL_SETTINGS[toolType] || TOOL_SETTINGS.default;

const getDayKey = timestamp => new Date(timestamp).toISOString().slice(0, 10);

const hashString = input => {
    let hash = 5381;

    for (let index = 0; index < input.length; index += 1) {
        hash = (hash * 33) ^ input.charCodeAt(index);
    }

    return Math.abs(hash).toString(36);
};

const createCacheKey = (toolType, data) =>
    `ugc-ai-${toolType}-${hashString(
        JSON.stringify({
            toolType,
            ...data,
        }),
    )}`;

const toObject = entries =>
    entries.reduce((accumulator, [key, value]) => {
        accumulator[key] = value;
        return accumulator;
    }, {});

const fetchWithTimeout = async (url, options, timeoutMs = REQUEST_TIMEOUT_MS) => {
    let timeoutId;

    try {
        return await Promise.race([
            fetch(url, options),
            new Promise((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Request timed out.')), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
};

const getCachedResult = async cacheKey => {
    const storedCache = safeJsonParse(await AsyncStorage.getItem(AI_CACHE_STORAGE_KEY)) || {};
    const cachedItem = storedCache[cacheKey];

    if (!cachedItem) return null;

    if (Date.now() - cachedItem.createdAt > CACHE_TTL_MS) {
        delete storedCache[cacheKey];
        await AsyncStorage.setItem(AI_CACHE_STORAGE_KEY, JSON.stringify(storedCache));
        return null;
    }

    return cachedItem.value;
};

const saveCachedResult = async (cacheKey, value) => {
    const now = Date.now();
    const storedCache = safeJsonParse(await AsyncStorage.getItem(AI_CACHE_STORAGE_KEY)) || {};

    const nextCache = {
        ...storedCache,
        [cacheKey]: {
            value,
            createdAt: now,
        },
    };

    const prunedEntries = Object.entries(nextCache)
        .filter(([, entry]) => entry?.createdAt && now - entry.createdAt <= CACHE_TTL_MS)
        .sort(([, previous], [, next]) => next.createdAt - previous.createdAt)
        .slice(0, MAX_CACHE_ENTRIES);

    await AsyncStorage.setItem(AI_CACHE_STORAGE_KEY, JSON.stringify(toObject(prunedEntries)));
};

const reserveQuotaSlot = async () => {
    const now = Date.now();
    const dayKey = getDayKey(now);
    const quotaState = safeJsonParse(await AsyncStorage.getItem(AI_QUOTA_STORAGE_KEY)) || {};
    const isSameDay = quotaState.dayKey === dayKey;
    const requestCount = isSameDay ? quotaState.requestCount || 0 : 0;
    const lastRequestAt = quotaState.lastRequestAt || 0;

    if (lastRequestAt && now - lastRequestAt < REQUEST_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((REQUEST_COOLDOWN_MS - (now - lastRequestAt)) / 1000);
        const cooldownError = new Error('cooldown');
        cooldownError.code = 'cooldown';
        cooldownError.waitSeconds = waitSeconds;
        throw cooldownError;
    }

    if (requestCount >= DAILY_REQUEST_LIMIT) {
        const dailyLimitError = new Error('daily_limit');
        dailyLimitError.code = 'daily_limit';
        throw dailyLimitError;
    }

    await AsyncStorage.setItem(
        AI_QUOTA_STORAGE_KEY,
        JSON.stringify({
            dayKey,
            requestCount: requestCount + 1,
            lastRequestAt: now,
        }),
    );
};

const saveHistoryResult = async (toolType, result) => {
    const storedHistory = safeJsonParse(await AsyncStorage.getItem(AI_HISTORY_STORAGE_KEY)) || [];
    const latestHistoryItem = storedHistory[storedHistory.length - 1];

    if (latestHistoryItem?.type === toolType && latestHistoryItem?.result === result) {
        return;
    }

    const nextHistory = [
        ...storedHistory.slice(-(MAX_HISTORY_ITEMS - 1)),
        {
            type: toolType,
            result,
        },
    ];

    await AsyncStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
};

const buildPrompts = (toolType, data) => {
    const { taskInstruction, maxTokens } = getToolSettings(toolType);

    const systemPrompt =
        'You write high-converting UGC copy for social creators. Keep the output compact, specific, and ready to use.';

    const userPrompt = [
        taskInstruction,
        `Brand: ${data.brandName}.`,
        `Product: ${data.productName}.`,
        `Description: ${data.productDescription}.`,
        data.valueProposition ? `Value proposition: ${data.valueProposition}.` : null,
        data.persona ? `Target audience: ${data.persona}.` : null,
        `Categories: ${data.selectedCategories.join(', ')}.`,
        'Do not add commentary or explanations.',
    ]
        .filter(Boolean)
        .join(' ');

    return {
        maxTokens,
        systemPrompt,
        userPrompt,
    };
};

const requestGroqCompletion = async ({ systemPrompt, userPrompt, maxTokens }) => {
    let lastErrorMessage = 'No content returned from Groq.';

    for (let index = 0; index < GROQ_MODEL_PREFERENCES.length; index += 1) {
        const model = GROQ_MODEL_PREFERENCES[index];
        const response = await fetchWithTimeout(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                temperature: 0.4,
                max_tokens: maxTokens,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
            }),
        });

        let payload = null;

        try {
            payload = await response.json();
        } catch (error) {
            payload = null;
        }

        if (!response.ok) {
            lastErrorMessage = payload?.error?.message || 'Unable to generate content right now.';

            if ((response.status === 400 || response.status === 404) && index < GROQ_MODEL_PREFERENCES.length - 1) {
                continue;
            }

            const requestError = new Error(lastErrorMessage);
            requestError.status = response.status;
            throw requestError;
        }

        const content = trimText(payload?.choices?.[0]?.message?.content);

        if (content) {
            return content;
        }
    }

    throw new Error(lastErrorMessage);
};

const useAITools = (toolType = 'scripts') => {
    const { t } = useTranslation();
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

    const onCategoriesPress = value => {
        if (selectedCategories.includes(value)) {
            setSelectedCategories(selectedCategories.filter(filter => filter !== value));
        } else {
            setSelectedCategories([...selectedCategories, value]);
        }
    };

    const handleSaveAndSubmit = async () => {
        const normalizedData = {
            brandName: trimText(brandName),
            productName: trimText(productName),
            productDescription: trimText(productDescription),
            valueProposition: trimText(valueProposition),
            persona: trimText(persona),
            selectedCategories,
        };

        if (
            !normalizedData.brandName ||
            !normalizedData.productName ||
            !normalizedData.productDescription ||
            !normalizedData.selectedCategories.length
        ) {
            Alert.alert(t('common.alerts.invalidFields'));
            return;
        }

        if (!GROQ_API_KEY) {
            Alert.alert(
                t('creatorTools.alerts.missingApiKeyTitle'),
                t('creatorTools.alerts.missingApiKeyMessage'),
            );
            return;
        }

        setResponseMessage(undefined);
        setLoading(true);

        try {
            const cacheKey = createCacheKey(toolType, normalizedData);
            const cachedResult = await getCachedResult(cacheKey);

            if (cachedResult) {
                setResponseMessage(cachedResult);
                await saveHistoryResult(toolType, cachedResult);
                return;
            }

            await reserveQuotaSlot();

            const { systemPrompt, userPrompt, maxTokens } = buildPrompts(toolType, normalizedData);
            const generatedContent = await requestGroqCompletion({
                systemPrompt,
                userPrompt,
                maxTokens,
            });

            setResponseMessage(generatedContent);
            await saveCachedResult(cacheKey, generatedContent);
            await saveHistoryResult(toolType, generatedContent);
        } catch (error) {
            console.log('SCRIPTS GENERATOR ERROR: ', error);

            if (error?.code === 'cooldown') {
                Alert.alert(
                    t('creatorTools.alerts.usageLimitTitle'),
                    t('creatorTools.alerts.cooldownMessage', { seconds: error?.waitSeconds || 0 }),
                );
                return;
            }

            if (error?.code === 'daily_limit') {
                Alert.alert(
                    t('creatorTools.alerts.usageLimitTitle'),
                    t('creatorTools.alerts.dailyLimitMessage'),
                );
                return;
            }

            if (error?.status === 429) {
                Alert.alert(
                    t('creatorTools.alerts.rateLimitTitle'),
                    t('creatorTools.alerts.rateLimitMessage'),
                );
                return;
            }

            Alert.alert(t('common.alerts.genericError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchContentGenerationResultsHistory = async () => {
        try {
            setLoadingHistory(true);
            const contentGenerationResults = await AsyncStorage.getItem(AI_HISTORY_STORAGE_KEY);
            setContentGenerationResultsHistory(safeJsonParse(contentGenerationResults) || []);
        } catch (error) {
            console.log('SCRIPTS GENERATOR HISTORY ERROR', error);
        } finally {
            setLoadingHistory(false);
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
        contentGenerationResultsHistory,
        fetchContentGenerationResultsHistory,
        loadingHistory,
    };
};

export default useAITools;
