import context from './context';
import useConfig from './useConfig';

// Individual Exports
export const {
    CoreProvider,
    CoreConsumer,
    CoreContext,
} = context;

export { useConfig };

// Default
export default {
    ...context,
    useConfig,
};
