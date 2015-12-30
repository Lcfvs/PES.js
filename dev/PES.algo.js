/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/PES.js
*/
'use strict';

var
PES;

PES = function(global) {
    var
    toCodePoints,
    fromCodePoints,
    fromByteString,
    toByteString,
    convert,
    getInternalKey,
    min,
    max,
    reverse,
    encryptData,
    decryptData;

    toCodePoints = function(str) {
        return [].map.call(str.normalize('NFKC'), function(chr) {
            return chr.codePointAt(0);
        });
    };

    fromCodePoints = function(points) {
        return String.fromCodePoint.apply(null, points);
    };

    fromByteString = function(str) {
        var
        codes;
        
        codes = [];
        
        str.split('').forEach(function(chr, key) {
            if (key & 1) {
                return;
            }
            
            codes.push(str.charCodeAt(key) * 256 + str.charCodeAt(key + 1));
        });
        
        return codes;
    };

    toByteString = function(codes) {
        var
        bytes;
        
        bytes = [];
        
        codes.forEach(function(value) {
            bytes.push(value >>> 8, value % 256);
        });
        
        return String.fromCharCode.apply(null, bytes);
    };

    convert = function(data, method, inEncoding, outEncoding) {
        if (method) {
            return method(data);
        }
        
        return (new Buffer(data, inEncoding)).toString(outEncoding);
    };
    
    getInternalKey = function(keyPoints, length) {
        var
        internalPoints,
        runner;
        
        internalPoints = encryptData(keyPoints, keyPoints);
        
        runner = function() {
            var
            temp;
            
            temp = encryptData(internalPoints, keyPoints);
            internalPoints = internalPoints.concat(temp);
            
            if (internalPoints.length > length) {
                return internalPoints;
            }
            
            return runner;
        };
        
        while (typeof runner === 'function') {
            runner = runner();
        }
        
        return runner;
    };

    min = function(values) {
        return values.reduce(function(previous, current) {
            return previous < current
                ? previous
                : current;
        });
    };

    max = function(values) {
        return values.reduce(function(previous, current) {
            return previous > current
                ? previous
                : current;
        });
    };

    reverse = function(dataPoints, keyPoint) {
        if ((min(dataPoints) ^ max(dataPoints) ^ keyPoint) & 1) {
            dataPoints.reverse();
        }
        
        return dataPoints;
    };
    
    encryptData = function(dataPoints, keyPoints) {
        dataPoints = dataPoints.slice(0);
        keyPoints = keyPoints.slice(0);
        
        keyPoints.forEach(function(keyPoint) {
            var
            last;
            
            last = keyPoint;
            
            dataPoints = reverse(dataPoints.map(function(dataPoint) {
                var
                current;
                
                current = ((last + dataPoint) ^ keyPoint) % 65536;
                last = dataPoint;
                
                return current;
            }), keyPoint);
        });
        
        return dataPoints;
    };

    decryptData = function(dataPoints, keyPoints) {
        dataPoints = dataPoints.slice(0);
        keyPoints = keyPoints.slice(0);
        keyPoints.reverse();

        keyPoints.forEach(function(keyPoint) {
            var
            last;
            
            last = keyPoint;
            
            dataPoints = reverse(dataPoints, keyPoint).map(function(dataPoint) {
                last = ((dataPoint ^ keyPoint) - last + 65536) % 65536;
                
                return last;
            });
        });
        
        return dataPoints;
    };
        
    return {
        encrypt: function(data, key) {
            var
            keyPoints,
            dataPoints,
            internalPoints,
            encrypted;
            
            keyPoints = toCodePoints(key);
            dataPoints = toCodePoints(data);
            internalPoints = getInternalKey(keyPoints, dataPoints.length);
            dataPoints = encryptData(dataPoints, internalPoints);
            encrypted = toByteString(dataPoints);

            return convert(encrypted, global.btoa, 'binary', 'base64');
        },
        decrypt: function(data, key) {
            var
            encrypted,
            keyPoints,
            dataPoints,
            internalPoints;
                
            encrypted = convert(data, global.atob, 'base64', 'binary');
            keyPoints = toCodePoints(key);
            dataPoints = fromByteString(encrypted);
            internalPoints = getInternalKey(keyPoints, dataPoints.length);
            dataPoints = decryptData(dataPoints, internalPoints);

            return fromCodePoints(dataPoints);
        }
    };
}(typeof global === 'object' ? global : this);