import { useContext } from 'react';
import CoreContextProvider from './context';

const { CoreContext } = CoreContextProvider;

export default () => {
    const config = useContext(CoreContext);
    return config;
};
