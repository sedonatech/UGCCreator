export const emailValid = email => /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(email);

export const passwordValid = password => password?.length >= 6;

export const isEmpty = value => value === '';
