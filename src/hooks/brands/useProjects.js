/* eslint-disable no-param-reassign */
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { projectStatuses } from '../../consts/AppFilters/ProjectStatus';
import useAuthContext from '../auth/useAuthContext';

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
    duration: [],
    description: '',
    shortDescription: '',
    applications: [],
};

const useProjects = () => {
    const [projects, setProjects] = useState([]);

    const [allProjects, setAllProjects] = useState([]);
    const [enrolledProjects, setEnrolledProjects] = useState([]);
    const { auth: authContext } = useAuthContext();
    const profile = authContext?.profile;
  
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
                brandName: profile?.name,
                isBlocked: false,
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getProjects = async (projectLimits = 8) => {
        try {
            setLoading(true);
            const db = firestore();
            const { uid } = auth().currentUser;
            // const uid = 'QZJ14IZYjTZpjGUkaJUyqjLmhYG3';
            const querySnapshot = await db.collection(PROJECTS_COLLECTION)
                .where('brandId', '==', uid)
                .orderBy('createdAt', 'desc')
                .limit(projectLimits)
                .get();
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc?.id, ...doc?.data() });
            });

            if (projectsData.length > 0) {
                setProjects(projectsData?.filter(({ brandId }) => brandId === uid));
            }
        } catch (error) {
            console.log('getProjects Error:', error);
        }
        setLoading(false);
    };

    const getAllProjects = async (projectLimits = 8) => {
        try {
            setLoading(true);
            const db = firestore();
            const querySnapshot = await db.collection(PROJECTS_COLLECTION)
                .where('isBlocked', '==', false)
                .orderBy('createdAt', 'desc')
                .limit(projectLimits)
                .get();
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc?.id, ...doc?.data() });
            });

            if (projectsData.length > 0) {
                setAllProjects(projectsData);
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
                const result = { id: doc?.id, ...doc?.data() };
                setProject(result);
                return result;
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getEnrolledProjects = async (id, projectLimits = 5) => {
        try {
            setLoading(true);
            const db = firestore();
            const querySnapshot = await db.collection(PROJECTS_COLLECTION)
                .where('enrolledUserIds', 'array-contains', id)
                .orderBy('createdAt', 'desc')
                .limit(projectLimits)
                .get();
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc?.id, ...doc?.data() });
            });

            if (projectsData.length > 0) {
                setEnrolledProjects(projectsData);
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

    const getStatus = (statusIndex) => projectStatuses.reduce((acc, curr, currIndex) => {
        if (statusIndex > currIndex) {
            curr.status = 'completed';
            acc.push(curr);
        } else if (statusIndex === currIndex) {
            curr.status = 'completed';
            acc.push(curr);
        } else if ((currIndex - 1) === statusIndex) {
            curr.status = 'active';
            acc.push(curr);
        } else {
            curr.status = 'inactive';
            acc.push(curr);
        }

        return acc;
    }, []);

    const enrollToProject = async (creatorID, selectedProject) => {
        try {
            const selectedProjectApplications = selectedProject?.applications;
            const enrolledUserIds = selectedProject?.enrolledUserIds || [];
            const selectedProjectEnrolledCreatorIds = selectedProjectApplications
                ?.map(({ creatorId }) => creatorId);

            if (!selectedProjectEnrolledCreatorIds?.includes(creatorID)) {
                selectedProjectApplications?.push({
                    id: `creator-${creatorID}-application-${selectedProject?.id}`,
                    creatorId: creatorID,
                    status: getStatus(0),
                    enrolledAt: Date.now(),
                    documents: [],
                });

                const newUserIds = [...enrolledUserIds, creatorID];
                await updateProject(selectedProject?.id,
                    {
                        applications: selectedProjectApplications,
                        enrolledUserIds: newUserIds,
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateProjectStatus = async (creatorID, selectedProject, currentStatusIndex) => {
        try {
            const selectedProjectApplications = selectedProject?.applications;
            const selectedProjectEnrolledCreatorIds = selectedProjectApplications
                ?.map(({ creatorId }) => creatorId);

            if (selectedProjectEnrolledCreatorIds?.includes(creatorID)) {
                const selectedApplication = selectedProjectApplications
                    ?.find(({ creatorId }) => creatorId === creatorID);
                selectedApplication.status = getStatus(currentStatusIndex);
                await updateProject(selectedProject?.id,
                    {
                        ...selectedProject,
                        applications: selectedProjectApplications,
                    });
            }
        } catch (error) {
            console.log(error);
        }
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
        getAllProjects,
        allProjects,
        enrollToProject,
        updateProjectStatus,
        getEnrolledProjects,
        enrolledProjects,
    };
};

export default useProjects;
