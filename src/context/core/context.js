import React, { useState, useEffect, createContext } from 'react';

const CoreContext = createContext(null);
const { Provider, Consumer: CoreConsumer } = CoreContext;

const CoreProvider = ({ children, config }) => {
    const [store, setStore] = useState({ ...config, update: null });

    // Logging only, can be removed
    useEffect(() => {
        console.log('[Core] Core Provider: Current store: ', store);
    }, [store]);

    // Updater
    const update = (key, data) => {
        console.log('[Core] Core Provider: Update called, updating store: ', key, data);

        setStore((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };

    // When config changes, re-initilise
    useEffect(() => {
        setStore({ ...config, update });
        console.log('[Core] Core Provider: Configured store');
    }, [config]);

    return (
        <Provider value={store}>
            {children}
        </Provider>
    );
};

export default {
    CoreContext,
    CoreProvider,
    CoreConsumer,
};
