import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    limit,
    addDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
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
        setEvent(prevState => ({
            ...prevState,
            [key]: data,
        }));
    };

    const createEvent = async eventData => {
        try {
            setLoading(true);
            const db = getFirestore();
            const { uid } = auth().currentUser;
            const eventsRef = collection(db, EVENTS_COLLECTION);
            const docRef = await addDoc(eventsRef, {
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
            const db = getFirestore();
            const { uid } = auth().currentUser;
            const eventsRef = collection(db, EVENTS_COLLECTION);
            const q = query(eventsRef, where('userId', '==', uid), limit(eventsLimit));
            const querySnapshot = await getDocs(q);
            const eventsData = [];
            querySnapshot.forEach(docSnap => {
                const data = docSnap?.data();
                if (!data?.isDeleted) {
                    eventsData.push({ docId: docSnap?.id, ...data });
                }
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
            const db = getFirestore();
            const eventsRef = collection(db, EVENTS_COLLECTION);
            const q = query(eventsRef, limit(eventsLimit));
            const querySnapshot = await getDocs(q);
            const eventsData = [];
            querySnapshot.forEach(docSnap => {
                const data = docSnap?.data();
                if (!data?.isDeleted) {
                    eventsData.push({ id: docSnap?.id, ...data });
                }
            });
            if (eventsData.length > 0) {
                setAllEvents(eventsData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getEvent = async id => {
        try {
            setLoading(true);
            const db = getFirestore();
            const eventRef = doc(db, EVENTS_COLLECTION, id);
            const docSnap = await getDoc(eventRef);
            if (docSnap.exists) {
                setEvent({ id: docSnap?.id, ...docSnap?.data() });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const updateEvent = async (id, eventData) => {
        try {
            setLoading(true);
            const db = getFirestore();
            const eventRef = doc(db, EVENTS_COLLECTION, id);
            await updateDoc(eventRef, eventData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteEvent = async id => {
        try {
            setLoading(true);
            const db = getFirestore();
            const eventRef = doc(db, EVENTS_COLLECTION, id);
            await updateDoc(eventRef, { isDeleted: true });
        } catch (error) {
            console.error('[DELETE EVENT ERROR]', error);
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
