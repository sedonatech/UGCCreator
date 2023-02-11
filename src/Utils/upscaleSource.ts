const upscaleSource = (baseUrl: string | null, quality = '720') => {
    if (!baseUrl) return null;
    return baseUrl.replace(/(\d\d\d\.mp4)$/g, `${quality}.mp4`);
};

export default upscaleSource;
