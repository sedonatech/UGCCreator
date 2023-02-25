export const randomFileName = () => Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);

export const options = {
    width: 750,
    height: 1000,
    cropping: true,
};

export const optionsLandscapeMode = {
    width: 1000,
    height: 700,
    cropping: true,
};
