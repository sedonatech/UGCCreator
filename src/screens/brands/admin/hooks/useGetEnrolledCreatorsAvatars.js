import { useMemo } from 'react';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import useGetCreators from '../../../../hooks/brands/useGetCreators';

const useGetEnrolledCreatorsAvatars = (projectId) => {
    const { projects } = useProjectsContext();

    const { creators } = useGetCreators();

    const selectedProject = useMemo(() => {
        if (!projects) return null;
        if (!projectId) return null;

        return projects?.find(({ id }) => id === projectId);
    }, [projects, projectId]);

    const enrolledCreatorsAvatars = useMemo(() => {
        if (!selectedProject) return null;

        return selectedProject?.applications?.reduce((acc, application) => {
            const creator = creators?.find(({ id }) => id === application?.creatorId);

            if (creator?.image) {
                acc.push(creator?.image);
            }

            return acc;
        }, []);
    }, [selectedProject, projectId, creators]);

    return {
        enrolledCreatorsAvatars,
    };
};

export default useGetEnrolledCreatorsAvatars;
