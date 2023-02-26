import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import useProjects from '../hooks/brands/useProjects';

const ProjectsContext = createContext();

const { Provider, Consumer: ProjectsConsumer } = ProjectsContext;

const ProjectsProvider = ({ children }) => {
    const {
        createProject,
        getProject,
        getProjects,
        updateProject,
        deleteProject,
        project,
        projects,
        loading,
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
    };

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
