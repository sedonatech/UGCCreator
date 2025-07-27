/* eslint-disable import/no-extraneous-dependencies */
const { KeyManagementServiceClient } = require('@google-cloud/kms');

const kms = new KeyManagementServiceClient();
const { KMS_KEY_NAME } = process.env;

async function encrypt(text) {
    const [result] = await kms.encrypt({
        name: KMS_KEY_NAME,
        plaintext: Buffer.from(text),
    });
    return result.ciphertext.toString('base64');
}

async function decrypt(ciphertext) {
    const [result] = await kms.decrypt({
        name: KMS_KEY_NAME,
        ciphertext: Buffer.from(ciphertext, 'base64'),
    });
    return result.plaintext.toString();
}

module.exports = { encrypt, decrypt };
