import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useProfile = () => {
  const createCreatorProfile = async (userName, currentUser) => {
    try {
      await firestore()
        .collection(USERS_COLLECTION)
        .doc(currentUser?.uid)
        .set({
          userName,
          email: currentUser?.email,
          id: currentUser?.uid,
          image: currentUser?.photoURL || '',
          shortDescription: '',
          description: '',
          socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            website: '',
          },
          sampleVideos: [],
          rates: {
            video: 10,
            photo: 10,
          },
          reviews: [],
          categories: [],
          location: {
            city: '',
            country: '',
          },
          phone: '',
          projects: [],
          type: 'creator',
        });
    } catch (e) {
      console.log(e);
    }
  };

  const createBrandProfile = async (userName, currentUser) => {
    try {
      await firestore().collection(USERS_COLLECTION).doc(currentUser?.uid).set({
        userName,
        email: currentUser?.email,
        id: currentUser?.uid,
        image: currentUser?.photoURL,
        shortDescription: '',
        description: '',
        reviews: [],
        categories: [],
        phone: '',
        projects: [],
        type: 'brand',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateProfile = async (data, id) => {
    try {
      await firestore()
        .collection(USERS_COLLECTION)
        .doc(id)
        .update({
          ...data,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const getProfile = async id => {
    try {
      const profile = await firestore()
        .collection(USERS_COLLECTION)
        .doc(id)
        .get();
      return profile.data();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    createCreatorProfile,
    createBrandProfile,
    updateProfile,
    getProfile,
  };
};

export default useProfile;
