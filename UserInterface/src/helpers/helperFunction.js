import { Buffer } from 'buffer'
const CryptoJS = require("crypto-js");

export const Base64EncodeUrl = (str) => {
    return str.replace(/\+/g, '-').replace(/\//g, '_');
}

export const Base64DecodeUrl = (str) => {
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

let url_iv = Base64DecodeUrl(`${process.env.MYWD_IV}`)
const iv = new Buffer.from(url_iv, 'base64').toString('ascii')

export const formatDate = (d) => {
    if (d === undefined || d === null) {
        return '-';
    }
    const date = new Date(d);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (dd < 10) { dd = `0${dd}`; }
    if (mm < 10) { mm = `0${mm}`; }
    if (hours < 10) { hours = `0${hours}`; }
    if (minutes < 10) { minutes = `0${minutes}`; }
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}`;
};

export const validate = obj => {
    let isValid = true;
    const { value, awsAccountId, awsAccessKey, awsSecretKey, clusterName, nodeCount, region, clusterDescription, azureSubscriptionId, azureTenentId, azureClientId, azureSecretKey, gcpAccountId, gcpMailId, gcpProjectId, gcpSecretKey } = obj;
    switch (value) {
        case 'eks':
            if (awsAccountId === "" || awsAccessKey === "" || awsSecretKey === "") {
                isValid = false;
            }
            break;
        case 'aks':
            if (azureSubscriptionId === "" || azureTenentId === "" || azureClientId === "" || azureSecretKey === "") {
                isValid = false;
            }
            break;
        case 'gke':
            if (gcpAccountId === "" || gcpMailId === "" || gcpProjectId === "" || gcpSecretKey === "") {
                isValid = false;
            }
            break;
        default:
            isValid = true;
    }

    if (clusterName === '' || nodeCount === '' || region === 'select' || clusterDescription === '') {
        isValid = false;
    }

    return isValid;
};

export const truncate = (source, size) => {
    if (!source) {
        return '';
    }
    return source.length > size ? `${source.slice(0, size - 1)}...` : source;
};

export const encryptionAlgorithm = (parameter, key) => {
    const encrypt = CryptoJS.AES.encrypt(parameter, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return Base64EncodeUrl(encrypt.toString())
};

export const decryptionAlgorithm = (parameter, key) => {
    let base64dec = Base64DecodeUrl(parameter)
    let decrypt = CryptoJS.AES.decrypt(base64dec, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    decrypt = decrypt.toString(CryptoJS.enc.Utf8);
    return decrypt;
};