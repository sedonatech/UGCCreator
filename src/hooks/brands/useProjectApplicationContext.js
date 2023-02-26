import { useContext } from 'react';
import { ProjectApplicationContext } from '../../context/ProjectApplicationProvider';

const useProjectApplication = () => {
    const projectApplicationContext = useContext(ProjectApplicationContext);

    return projectApplicationContext;
};

export default useProjectApplication;
