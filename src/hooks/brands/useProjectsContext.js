import { useContext } from 'react';
import { ProjectsContext } from '../../context/ProjectsProvider';

const useProjectsContext = () => {
    const projectsContext = useContext(ProjectsContext);

    return projectsContext;
};

export default useProjectsContext;
