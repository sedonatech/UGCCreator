import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import useProjects from '../hooks/brands/useProjects';
import useAuthContext from '../hooks/auth/useAuthContext';
import useGetCreators from '../hooks/brands/useGetCreators';

const ProjectsContext = createContext();

const { Provider, Consumer: ProjectsConsumer } = ProjectsContext;

const ProjectsProvider = ({ children }) => {
    const { auth } = useAuthContext();
    const [projectLimits, setProjectLimits] = useState(6);

    const userType = auth?.profile?.type;

    const { creators, getCreators } = useGetCreators();

    const getEnrolledCreators = (creatorIds) => {
        if (!creatorIds && !creators) return [];
        return getCreators(creatorIds);
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
        getEnrolledProjects,
        enrolledProjects,
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
        projectLimits,
        setProjectLimits,
        getEnrolledProjects,
        enrolledProjects,
    };

    useEffect(() => {
        if (userType === 'creator') {
            getAllProjects(projectLimits);
        } else {
            getProjects(projectLimits);
        }
    }, [userType, projectLimits]);

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
