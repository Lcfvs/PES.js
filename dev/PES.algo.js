/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
var PES;
(function () {
    'use strict';
    var PES, encodingLengths, getCharCodes, getInternalKey, encrypt, decrypt, encryptData, decryptData;
    PES = function PES() {
        this.encrypt = encrypt;
        this.decrypt = decrypt;
    };
    encodingLengths = {
        'utf-8': 65536
    };
    getCharCodes = function getCharCodes(data) {
        var iterator, charCodes, length;
        iterator = 0;
        charCodes = [];
        length = data.length;
        try {
            while (iterator < length) {
                charCodes.push(data.charCodeAt(iterator));
                iterator += 1;
            }
        } catch (e) {
            charCodes = charCodes.concat(getCharCodes(data.substring(iterator)));
        }
        return charCodes;
    };
    getInternalKey = function (encryptionKey, dataLength, encoding, currentKey) {
        var key, dataCodes, keyCodes;
        if (encryptionKey.length === 0) {
            throw new Error('Invalid encryption key length');
        }
        key = currentKey || '';
        try {
            while (key.length < dataLength) {
                dataCodes = getCharCodes(encryptionKey);
                keyCodes = getCharCodes(key || encryptionKey);
                encryptData(dataCodes, keyCodes, encodingLengths[encoding], dataCodes.length - 1, 0);
                key += String.fromCharCode.apply(null, dataCodes);
            }
        } catch(e) {
             key += getInternalKey(encryptionKey, dataLength, encoding, key);
        }
        if (currentKey === undefined) {
            dataCodes = getCharCodes(encryptionKey);
            keyCodes = getCharCodes(key);
            encryptData(dataCodes, keyCodes, encodingLengths[encoding], dataCodes.length - 1, 0);
            key += String.fromCharCode.apply(null, dataCodes);
        }
        return key;
    };
    encrypt = function encrypt(data, encryptionKey, encoding) {
        var dataCodes, keyCodes;
        dataCodes = getCharCodes(data);
        keyCodes = getCharCodes(getInternalKey(encryptionKey, dataCodes.length, encoding));
        encryptData(dataCodes, keyCodes, encodingLengths[encoding], dataCodes.length - 1, 0);
        return String.fromCharCode.apply(null, dataCodes);
    };
    decrypt = function decrypt(data, encryptionKey, encoding) {
        var dataCodes, keyCodes;
        dataCodes = getCharCodes(data);
        keyCodes = getCharCodes(getInternalKey(encryptionKey, dataCodes.length, encoding));
        decryptData(dataCodes, keyCodes, encodingLengths[encoding], 0, keyCodes.length - 1);
        return String.fromCharCode.apply(null, dataCodes);
    };
    encryptData = function encryptData(dataCodes, keyCodes, encodingLength, dataIterator, keyIterator) {
        var dataLimit, keyLength, dataCode, keyCode, prevDataCode;
        dataLimit = dataCodes.length - 1;
        keyLength = keyCodes.length;
        keyCode = keyCodes[keyIterator];
        try {
            while (keyIterator < keyLength) {
                if (dataIterator === dataLimit) {
                    if ((Math.min.apply(null, dataCodes) ^ Math.max.apply(null, dataCodes) ^ keyCode ^ encodingLength) & 1) {
                        dataCodes.reverse();
                    }
                }
                dataCode = dataCodes[dataIterator];
                prevDataCode = dataIterator !== 0 ? dataCodes[dataIterator - 1] : keyCode;
                dataCodes[dataIterator] = (prevDataCode + dataCode) ^ keyCode;
                if (dataCodes[dataIterator] >= encodingLength) {
                    dataCodes[dataIterator] -= encodingLength;
                }
                if (dataIterator === 0) {
                    dataIterator = dataLimit;
                    keyIterator += 1;
                    keyCode = keyCodes[keyIterator];
                } else {
                    dataIterator -= 1;
                }
            }
        } catch (e) {
            encryptData(dataCodes, keyCodes, encodingLength, dataIterator, keyIterator);
        }
        return dataCodes;
    };
    decryptData = function decryptData(dataCodes, keyCodes, encodingLength, dataIterator, keyIterator) {
        var dataLimit, dataCode, keyCode, prevDataCode;
        dataLimit = dataCodes.length - 1;
        keyCode = keyCodes[keyIterator];
        try {
            while (keyIterator > -1) {
                dataCode = dataCodes[dataIterator];
                prevDataCode = dataIterator !== 0 ? dataCodes[dataIterator - 1] : keyCode;
                dataCodes[dataIterator] = (dataCodes[dataIterator] ^ keyCode) - prevDataCode;
                if (dataCodes[dataIterator] < 0) {
                    dataCodes[dataIterator] += encodingLength;
                }
                if (dataIterator === dataLimit) {
                    if ((Math.min.apply(null, dataCodes) ^ Math.max.apply(null, dataCodes) ^ keyCode ^ encodingLength) & 1) {
                        dataCodes.reverse();
                    }
                    dataIterator = 0;
                    keyIterator -= 1;
                    keyCode = keyCodes[keyIterator];
                } else {
                    dataIterator += 1;
                }
            }
        } catch (e) {
            decryptData(dataCodes, keyCodes, encodingLength, dataIterator, keyIterator);
        }
        return dataCodes;
    };
    self.PES = new PES;
}());