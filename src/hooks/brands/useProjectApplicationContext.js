import { useContext } from 'react';
import { ProjectApplicationContext } from '../../context/ProjectApplicationProvider';

const useProjectApplicationContext = () => {
    const projectApplicationContext = useContext(ProjectApplicationContext);

    return projectApplicationContext;
};

export default useProjectApplicationContext;
