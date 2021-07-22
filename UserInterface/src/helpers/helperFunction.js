import { Buffer } from 'buffer'
const CryptoJS = require("crypto-js");

export const Base64EncodeUrl = (str) => {
    return str.replace(/\+/g, '-').replace(/\//g, '_');
}

export const Base64DecodeUrl = (str) =>{
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

export const encryptionAlgorithm = (parameter) => {
    let url_iv = Base64DecodeUrl(`${process.env.MYWD_IV}`)
    const iv = new Buffer.from(url_iv, 'base64').toString('ascii')
    let url_key = Base64DecodeUrl(`${process.env.MYWD_KEY}`)
    const aes_key = new Buffer.from(url_key, 'base64').toString('ascii')
    const encrypt = CryptoJS.AES.encrypt(parameter, CryptoJS.enc.Utf8.parse(aes_key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return Base64EncodeUrl(encrypt.toString())
};

export const decryptionAlgorithm = (parameter) => {
    let url_iv = Base64DecodeUrl(`${process.env.MYWD_IV}`)
    const iv = new Buffer.from(url_iv, 'base64').toString('ascii')
    let url_key = Base64DecodeUrl(`${process.env.MYWD_KEY}`)
    const aes_key = new Buffer.from(url_key, 'base64').toString('ascii')
    let base64dec = Base64DecodeUrl(parameter)
    let decrypt = CryptoJS.AES.decrypt(base64dec, CryptoJS.enc.Utf8.parse(aes_key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    decrypt = decrypt.toString(CryptoJS.enc.Utf8);
    return decrypt;

};