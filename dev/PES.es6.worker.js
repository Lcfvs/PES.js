/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/PES.js
*/
'use strict';
    
var
PES;

PES = ((
    global,
    toCodePoints = str =>
        [].map.call(str.normalize('NFKC'), chr =>
            chr.codePointAt(0)),
    fromCodePoints = points =>
        String.fromCodePoint.apply(null, points),
    fromByteString = (str, codes = []) => (
        str.split('').forEach((chr, key) => (
            !(key & 1)
            && codes.push(str.charCodeAt(key) * 256 + str.charCodeAt(key + 1)))
        ),
        codes
    ),
    toByteString = (codes, bytes = []) =>
        String.fromCharCode.apply(null, (
            codes.forEach(value =>
                bytes.push(value >>> 8, value % 256)
            ),
            bytes
        )),
    convert = (data, method, inEncoding, outEncoding) =>
        method
            ? method(data)
            : (new Buffer(data, inEncoding)).toString(outEncoding),
    getInternalKey = (
        keyPoints,
        length,
        internalPoints = encryptData(keyPoints, keyPoints),
        runner = (temp = encryptData(internalPoints, keyPoints)) => (
            internalPoints = internalPoints.concat(temp),
            internalPoints.length > length
                ? internalPoints
                : runner()
            )
        ) => runner(),
    min = values => values.reduce((previous, current) =>
        previous < current
            ? previous
            : current
    ),
    max = values => values.reduce((previous, current) =>
        previous > current
            ? previous
            : current
    ),
    reverse = (dataPoints, keyPoint) => (
        (min(dataPoints) ^ max(dataPoints) ^ keyPoint) & 1 && dataPoints.reverse(),
        dataPoints
    ),
    encryptData = (dataPoints, keyPoints) => (
        dataPoints = dataPoints.slice(0),
        keyPoints = keyPoints.slice(0),
        keyPoints.forEach((keyPoint, last) => (
            last = keyPoint,
            dataPoints = reverse(dataPoints.map((dataPoint, current) =>
                (current = (last + dataPoint ^ keyPoint) % 65536,
                last = dataPoint,
                current)),
                keyPoint
            )
        )),
        dataPoints
    ),
    decryptData = (dataPoints, keyPoints) => (
        dataPoints = dataPoints.slice(0),
        keyPoints = keyPoints.slice(0),
        keyPoints.reverse(),
        keyPoints.forEach((keyPoint, last) => (
            last = keyPoint,
            dataPoints = reverse(dataPoints, keyPoint).map(dataPoint =>
                last = ((dataPoint ^ keyPoint) - last + 65536) % 65536
            )
        )),
        dataPoints
    )) =>
    ({
        encrypt: (data, key) => ((dataPoints = toCodePoints(data)) => convert(toByteString(encryptData(dataPoints, getInternalKey(toCodePoints(key), dataPoints.length))), global.btoa, 'binary', 'base64'))(),
        decrypt: (data, key) => ((dataPoints = fromByteString(convert(data, global.atob, 'base64', 'binary'))) => fromCodePoints(decryptData(dataPoints, getInternalKey(toCodePoints(key), dataPoints.length))))()
    }))(typeof global === 'object' ? global : this);
    
self.addEventListener('message', (event, message = event.data) => 
    self.postMessage({
        type: 'result',
        data: PES[message.method](message.data, message.key)
    }),
    false
);