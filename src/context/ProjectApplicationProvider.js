import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const ProjectApplicationContext = createContext();

const { Provider, Consumer: ProjectApplicationConsumer } = ProjectApplicationContext;
const ProjectApplicationProvider = ({ children }) => {
    const value = {

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
