import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

const PROJECTS_COLLECTION = 'projects';

const initialProjectState = {
    brandId: '',
    image: '',
    title: '',
    deliveryFormat: [],
    socials: [],
    startDate: '',
    endDate: '',
    priceRange: {
        min: 0,
        max: 0,
    },
    currency: {
        code: '',
        symbol: '',
    },
    categories: [],
    countries: [],
    gender: [],
    languages: [],
    ageRange: [],
    projectType: [],
    deliverFormat: [],
    duration: [],
    description: '',
    shortDescription: '',
};

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(initialProjectState);
    const [loading, setLoading] = useState(false);

    const update = (key, data) => {
        console.log('[Projects] Use projects: ', key, data);
        setProject((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };
    const createProject = async (projectData) => {
        try {
            setLoading(true);
            const db = firestore();
            const { uid } = auth().currentUser;
            const docRef = await db.collection(PROJECTS_COLLECTION).add({
                ...projectData,
                brandId: uid,
                createdAt: Date.now(),
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getProjects = async () => {
        try {
            setLoading(true);
            const db = firestore();
            const { uid } = auth().currentUser;
            const querySnapshot = await db.collection(PROJECTS_COLLECTION).where('brandId', '==', uid).get();
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc?.id, ...doc?.data() });
            });

            if (projectsData.length > 0) {
                setProjects(projectsData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getProject = async (id) => {
        try {
            setLoading(true);
            const db = firestore();
            const doc = await db.collection(PROJECTS_COLLECTION).doc(id).get();

            if (doc.exists) {
                setProject({ id: doc?.id, ...doc?.data() });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const updateProject = async (id, projectData) => {
        try {
            setLoading(true);
            const db = firestore();
            await db.collection(PROJECTS_COLLECTION).doc(id).update(projectData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteProject = async (id) => {
        try {
            setLoading(true);
            const db = firestore();
            await db.collection(PROJECTS_COLLECTION).doc(id).delete();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return {
        createProject,
        getProjects,
        getProject,
        updateProject,
        deleteProject,
        projects,
        project,
        loading,
        update,
    };
};

export default useProjects;
