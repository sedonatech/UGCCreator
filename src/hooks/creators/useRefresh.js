import { useState } from 'react';
import useProjectsContext from '../brands/useProjectsContext';
import useGetBrands from './useGetBrands';
import useGetCreators from '../brands/useGetCreators';

const useRefresh = () => {
    const [refreshing, setRefreshing] = useState(false);

    const { getAllProjects } = useProjectsContext();

    const { getBrands } = useGetBrands();

    const { getAllCreators } = useGetCreators();

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
            // await getAllCreators();
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
