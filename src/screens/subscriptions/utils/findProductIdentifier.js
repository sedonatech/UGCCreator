export default (id, productMap) => {
    if (Object.keys(productMap).map((key) => productMap[key]?.productId).includes(id)) {
        const [foundId] = keys(productMap).filter((key) => productMap[key]?.productId === id);
        return foundId;
    }
    return id;
};
