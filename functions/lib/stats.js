function mean(arr) {
    return arr.length ? arr.reduce((sum, x) => sum + x, 0) / arr.length : 0;
}

function median(arr) {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 1
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

module.exports = { mean, median };
