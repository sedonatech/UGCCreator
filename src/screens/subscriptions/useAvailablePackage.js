import { useMemo } from 'react';
import useAvailablePackages from './useAvailablePackages';

const useAvailablePackage = (key) => {
    const [availablePackages] = useAvailablePackages();
    const response = useMemo(
        () => availablePackages?.length && availablePackages?.find(
            (availablePackage) => availablePackage?.product?.identifier === key,
        ),
        [availablePackages, key],
    );

    return response;
};

export default useAvailablePackage;
