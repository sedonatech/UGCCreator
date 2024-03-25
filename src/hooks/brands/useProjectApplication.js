import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

const APPLICATION = 'application';

const useProjectApplication = () => {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [application, setApplication] = useState({});
    const createApplication = async (applicationData) => {
        // try {
        //     setLoading(true);
        //     const { uid } = auth().currentUser;
        //     const { id } = await firestore()
        //         .collection(APPLICATION)
        //         .add({ ...applicationData, uid });
        //     console.log('id', id);
        // } catch (error) {
        //     console.log('error', error);
        // }
        // setLoading(false);
    };

    const getApplication = async (id) => {
        // try {
        //     setLoading(true);
        //     const applicationData = await firestore()
        //         .collection(APPLICATION)
        //         .doc(id)
        //         .get();

        //     if (applicationData?.data()) {
        //         setApplication(applicationData?.data());
        //     }
        // } catch (error) {
        //     console.log('error', error);
        // }
        // setLoading(false);
    };

    const getApplications = async () => {
        // try {
        //     setLoading(true);
        //     const { uid } = auth().currentUser;
        //     const applicationsData = await firestore()
        //         .collection(APPLICATION)
        //         .where('uid', '==', uid)
        //         .get();
        //     if (applicationsData?.docs?.length > 0) {
        //         const applicationsList = applicationsData.docs.map((doc) => ({
        //             id: doc.id,
        //             ...doc.data(),
        //         }));
        //         setApplications(applicationsList);
        //     }
        // } catch (error) {
        //     console.log('error', error);
        // }
        // setLoading(false);
    };

    const updateApplication = async (id, applicationData) => {
        // try {
        //     setLoading(true);
        //     await firestore()
        //         .collection(APPLICATION)
        //         .doc(id)
        //         .update(applicationData);
        // } catch (error) {
        //     console.log('error', error);
        // }
        // setLoading(false);
    };

    const deleteApplication = async (id) => {
        // try {
        //     setLoading(true);
        //     await firestore()
        //         .collection(APPLICATION)
        //         .doc(id)
        //         .delete();
        // } catch (error) {
        //     console.log('error', error);
        // }
        // setLoading(false);
    };

    return {
        createApplication,
        getApplication,
        getApplications,
        updateApplication,
        deleteApplication,
        applications,
        application,
        loading,
    };
};

export default useProjectApplication;
