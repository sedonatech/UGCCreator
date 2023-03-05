import { useContext } from 'react';
import { SubscriptionContext } from './context/context';

export default () => {
    const subscription = useContext(SubscriptionContext);

    return subscription;
};
