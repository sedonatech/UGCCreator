import { keys } from 'lodash';

export default (id, productMap) => {
    if (keys(productMap).map((key) => productMap[key]?.productId).includes(id)) {
        const [foundId] = keys(productMap).filter((key) => productMap[key]?.productId === id);
        return foundId;
    }
    return id;
};
