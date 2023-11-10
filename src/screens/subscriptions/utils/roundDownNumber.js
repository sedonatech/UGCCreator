export default (num, roundDown) => {
    if (!num) {
        return null;
    }

    if(roundDown === false){
        return num
    }

    if (roundDown === true) {
        return Math.floor(num);
    }

    return (parseInt(Math.floor(num / 5)) * 5);
};
