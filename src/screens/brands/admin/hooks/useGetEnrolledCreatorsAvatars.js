import { useMemo } from 'react';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';

const useGetEnrolledCreatorsAvatars = (projectId) => {
    const { projects } = useProjectsContext();

    const selectedProject = useMemo(() => {
        if (!projects) return null;
        if (!projectId) return null;

        return projects?.find(({ id }) => id === projectId);
    }, [projects, projectId]);

    const enrolledCreatorsAvatars = useMemo(() => {
        if (!selectedProject) return [];
        if (!Array.isArray(selectedProject?.applications)) return [];

        return selectedProject.applications.reduce((acc, application) => {
            if (application?.creatorImage && typeof application.creatorImage === 'string') {
                acc.push(application.creatorImage);
            }
            return acc;
        }, []);
    }, [selectedProject, projectId]);

    return {
        enrolledCreatorsAvatars,
    };
};

export default useGetEnrolledCreatorsAvatars;
