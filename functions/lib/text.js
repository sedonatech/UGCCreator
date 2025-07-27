function extractHashtags(text = '') {
    // Unicode letter support
    return (text.match(/#[\p{L}\w]+/gu) || []).map((tag) => tag.toLowerCase());
}

module.exports = { extractHashtags };
