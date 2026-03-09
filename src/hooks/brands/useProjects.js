import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { projectStatuses } from '../../consts/AppFilters/ProjectStatus';
import useAuthContext from '../auth/useAuthContext';
import useNotifications from '../notifications/useNotifications';

const PROJECTS_COLLECTION = 'projects';
const USERS_COLLECTION = 'users';

const initialProjectState = {
    brandId: '',
    image: '',
    title: '',
    link: '',
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
    const { sendNotification } = useNotifications();

    const getFCMToken = async userId => {
        try {
            const db = getFirestore();
            const userRef = doc(db, USERS_COLLECTION, userId);
            const userSnap = await getDoc(userRef);
            return userSnap?.data()?.fcmToken || null;
        } catch (error) {
            console.log('getFCMToken error:', error);
            return null;
        }
    };

    const notifyBothParties = async (creatorId, brandId, title, body, data) => {
        try {
            const [creatorToken, brandToken] = await Promise.all([getFCMToken(creatorId), getFCMToken(brandId)]);
            const tokens = [creatorToken, brandToken].filter(Boolean);
            await Promise.all(tokens.map(token => sendNotification(token, title, body, data)));
        } catch (error) {
            console.log('notifyBothParties error:', error);
        }
    };

    const update = (key, data) => {
        console.log('[Projects] Use projects: ', key, data);
        setProject(prevState => ({
            ...prevState,
            [key]: data,
        }));
    };
    const createProject = async projectData => {
        try {
            setLoading(true);
            const db = getFirestore();
            const { uid } = auth().currentUser;
            const projectsRef = collection(db, PROJECTS_COLLECTION);
            const docRef = await addDoc(projectsRef, {
                ...projectData,
                brandId: uid,
                createdAt: Date.now(),
                brandName: profile?.name,
                isBlocked: false,
            });
            console.log('Document written with ID: ', docRef.id);
            return docRef;
        } catch (error) {
            console.log(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getProjects = async (projectLimits = 8) => {
        try {
            setLoading(true);
            const db = getFirestore();
            const { uid } = auth().currentUser;
            const projectsRef = collection(db, PROJECTS_COLLECTION);
            const q = query(
                projectsRef,
                where('brandId', '==', uid),
                orderBy('createdAt', 'desc'),
                limit(projectLimits),
            );
            const querySnapshot = await getDocs(q);
            const projectsData = [];
            querySnapshot.forEach(docSnap => {
                projectsData.push({ id: docSnap?.id, ...docSnap?.data() });
            });
            if (projectsData.length > 0) {
                setProjects(projectsData?.filter(({ brandId }) => brandId === uid));
            }
        } catch (error) {
            console.log('getProjects Error:', error);
        }
        setLoading(false);
    };

    const getAllProjects = async () => {
        try {
            setLoading(true);
            const db = getFirestore();
            const projectsRef = collection(db, PROJECTS_COLLECTION);
            const q = query(projectsRef, where('isBlocked', '==', false), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const projectsData = [];
            querySnapshot.forEach(docSnap => {
                projectsData.push({ id: docSnap?.id, ...docSnap?.data() });
            });
            if (projectsData.length > 0) {
                setAllProjects(projectsData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getProject = async id => {
        try {
            setLoading(true);
            const db = getFirestore();
            const projectRef = doc(db, PROJECTS_COLLECTION, id);
            const docSnap = await getDoc(projectRef);
            if (docSnap.exists) {
                const result = { id: docSnap?.id, ...docSnap?.data() };
                setProject(result);
                return result;
            }
            setProject(initialProjectState);
            return initialProjectState;
        } catch (error) {
            console.log(error);
            setProject(initialProjectState);
            return initialProjectState;
        }
    };

    const getEnrolledProjects = async (id, projectLimits = 5) => {
        try {
            setLoading(true);
            const db = getFirestore();
            const projectsRef = collection(db, PROJECTS_COLLECTION);
            const q = query(
                projectsRef,
                where('enrolledUserIds', 'array-contains', id),
                orderBy('createdAt', 'desc'),
                limit(projectLimits),
            );
            const querySnapshot = await getDocs(q);
            const projectsData = [];
            querySnapshot.forEach(docSnap => {
                projectsData.push({ id: docSnap?.id, ...docSnap?.data() });
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
            const db = getFirestore();
            const projectRef = doc(db, PROJECTS_COLLECTION, id);
            await updateDoc(projectRef, projectData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const deleteProject = async id => {
        try {
            setLoading(true);
            const db = getFirestore();
            const projectRef = doc(db, PROJECTS_COLLECTION, id);
            await deleteDoc(projectRef);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getStatus = statusIndex =>
        projectStatuses.reduce((acc, curr, currIndex) => {
            if (statusIndex > currIndex) {
                curr.status = 'completed';
                acc.push(curr);
            } else if (statusIndex === currIndex) {
                curr.status = 'completed';
                acc.push(curr);
            } else if (currIndex - 1 === statusIndex) {
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
            const selectedProjectEnrolledCreatorIds = selectedProjectApplications?.map(({ creatorId }) => creatorId);

            if (!selectedProjectEnrolledCreatorIds?.includes(creatorID)) {
                selectedProjectApplications?.push({
                    id: `creator-${creatorID}-application-${selectedProject?.id}`,
                    creatorId: creatorID,
                    status: getStatus(0),
                    enrolledAt: Date.now(),
                    documents: [],
                });

                const newUserIds = [...enrolledUserIds, creatorID];
                await updateProject(selectedProject?.id, {
                    applications: selectedProjectApplications,
                    enrolledUserIds: newUserIds,
                });

                await notifyBothParties(
                    creatorID,
                    selectedProject?.brandId,
                    'New Project Enrollment',
                    `A creator has enrolled in "${selectedProject?.title}"`,
                    {
                        type: 'project_enrollment',
                        projectID: selectedProject?.id,
                    },
                );

                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const updateProjectStatus = async (creatorID, selectedProject, currentStatusIndex) => {
        try {
            const selectedProjectApplications = selectedProject?.applications;
            const selectedProjectEnrolledCreatorIds = selectedProjectApplications?.map(({ creatorId }) => creatorId);

            if (selectedProjectEnrolledCreatorIds?.includes(creatorID)) {
                const selectedApplication = selectedProjectApplications?.find(
                    ({ creatorId }) => creatorId === creatorID,
                );
                selectedApplication.status = getStatus(currentStatusIndex);
                await updateProject(selectedProject?.id, {
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
