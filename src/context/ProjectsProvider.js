import React, { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import useProjects from '../hooks/brands/useProjects';
import useAuthContext from '../hooks/auth/useAuthContext';
import useGetCreators from '../hooks/brands/useGetCreators';

const ProjectsContext = createContext();

const { Provider, Consumer: ProjectsConsumer } = ProjectsContext;

const ProjectsProvider = ({ children }) => {
    const { auth } = useAuthContext();

    const userType = auth?.profile?.type;

    const { creators } = useGetCreators();

    const getEnrolledCreators = (creatorIds) => {
        if (!creatorIds && !creators) return [];
        return creators?.reduce((acc, cr) => {
            creatorIds?.forEach((id) => {
                if (id === cr?.id) {
                    acc?.push(cr);
                }
            });

            return acc;
        }, []);
    };

    const {
        createProject,
        getProject,
        getProjects,
        updateProject,
        deleteProject,
        project,
        projects,
        loading,
        getAllProjects,
        allProjects,
        enrollToProject,
        updateProjectStatus,
    } = useProjects();

    const value = {
        createProject,
        getProject,
        getProjects,
        updateProject,
        deleteProject,
        project,
        projects,
        loading,
        getAllProjects,
        allProjects,
        enrollToProject,
        getEnrolledCreators,
        updateProjectStatus,
    };

    useEffect(() => {
        if (userType === 'creator') {
            getAllProjects();
        } else {
            getProjects();
        }
    }, [userType]);

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

ProjectsProvider.propTypes = {
    children: PropTypes.node,
};

ProjectsProvider.defaultProps = {
    children: null,
};

export {
    ProjectsContext,
    ProjectsProvider,
    ProjectsConsumer,
};
