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
            await getAllCreators();
        } catch (error) {
            setRefreshing(false);
        }
        setRefreshing(false);
    };

    const handleBrandRefresh = async () => {
        setRefreshing(true);
        await getAllProjects();
        setRefreshing(false);
    };
    return {
        refreshing,
        handleRefresh,
        handleBrandRefresh,
    };
};

export default useRefresh;
