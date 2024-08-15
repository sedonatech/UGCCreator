/* eslint-disable no-param-reassign */
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const EVENTS_COLLECTION = 'events';

const initialEventState = {
    userId: '',
    image: '',
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    categories: [],
    country: '',
    city: '',
    description: '',
    likes: [],
    link: '',
    startTime: new Date(),
};

const useEvents = (eventsLimit = 5) => {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [event, setEvent] = useState(initialEventState);
    const [loading, setLoading] = useState(false);

    const update = (key, data) => {
        console.log('[Events] update event: ', key, data);
        setEvent((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };

    const createEvent = async (eventData) => {
        try {
            setLoading(true);
            const db = firestore();
            const { uid } = auth().currentUser;
            const docRef = await db.collection(EVENTS_COLLECTION).add({
                ...eventData,
                eventId: uuidv4(),
                userId: uid,
                createdAt: Date.now(),
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getEvents = async () => {
        try {
            setLoading(true);
            const db = firestore();
            const { uid } = auth().currentUser;
            const querySnapshot = await db.collection(EVENTS_COLLECTION).where('userId', '==', uid).limit(eventsLimit).get();
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ docId: doc?.id, ...doc?.data() });
            });

            if (eventsData.length > 0) {
                setEvents(eventsData);
            }
        } catch (error) {
            console.log('getEvents Error:', error);
        }
        setLoading(false);
    };

    const getAllEvents = async () => {
        try {
            setLoading(true);
            const db = firestore();
            const querySnapshot = await db.collection(EVENTS_COLLECTION).limit(eventsLimit).get();
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc?.id, ...doc?.data() });
            });

            if (eventsData.length > 0) {
                setAllEvents(eventsData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getEvent = async (id) => {
        try {
            setLoading(true);
            const db = firestore();
            const doc = await db.collection(EVENTS_COLLECTION).doc(id).get();
            if (doc.exists) {
                setEvent({ id: doc?.id, ...doc?.data() });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const updateEvent = async (id, eventData) => {
        try {
            setLoading(true);
            const db = firestore();
            await db.collection(EVENTS_COLLECTION).doc(id).update(eventData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteEvent = async (id) => {
        try {
            setLoading(true);
            const db = firestore();
            await db.collection(EVENTS_COLLECTION).doc(id).delete();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return {
        createEvent,
        getEvents,
        getEvent,
        updateEvent,
        deleteEvent,
        events,
        event,
        loading,
        update,
        getAllEvents,
        allEvents,
        setEvent,
    };
};

export default useEvents;
