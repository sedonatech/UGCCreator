export default (data) => {
    if (!data?.length) return [];

    return data?.reduce((acc, curr) => {
        if (!acc.find((item) => item?.name === curr?.name)) {
            acc.push(curr);
        }
        return acc;
    }, []);
};
