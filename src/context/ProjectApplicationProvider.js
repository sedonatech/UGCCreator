import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useProjectApplication from '../hooks/brands/useProjectApplication';

const ProjectApplicationContext = createContext();

const { Provider, Consumer: ProjectApplicationConsumer } = ProjectApplicationContext;
const ProjectApplicationProvider = ({ children }) => {
    const {
        createApplication,
        updateApplication,
        deleteApplication,
        getApplication,
        getApplications,
        application,
        applications,
        loading,
    } = useProjectApplication();

    const value = {
        createApplication,
        updateApplication,
        deleteApplication,
        getApplication,
        getApplications,
        application,
        applications,
        loading,
    };

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

ProjectApplicationProvider.propTypes = {
    children: PropTypes.node,
};

ProjectApplicationProvider.defaultProps = {
    children: null,
};

export {
    ProjectApplicationProvider,
    ProjectApplicationConsumer,
    ProjectApplicationContext,
};
