import { useState } from 'react';
import useProjectsContext from '../brands/useProjectsContext';
import useGetBrands from './useGetBrands';

const useRefresh = () => {
    const [refreshing, setRefreshing] = useState(false);

    const projectContext = useProjectsContext();
    const getAllProjects = projectContext?.getAllProjects || null;

    const { getBrands } = useGetBrands();

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await getAllProjects();
            await getBrands();
        } catch (error) {
            setRefreshing(false);
        }
        setRefreshing(false);
    };

    const handleBrandRefresh = async () => {
        try {
            setRefreshing(true);
            await getAllProjects();
        } catch (error) {
            console.log('REFRESHING ERROR: ', error);
        }

        setRefreshing(false);
    };
    return {
        refreshing,
        handleRefresh,
        handleBrandRefresh,
    };
};

export default useRefresh;
