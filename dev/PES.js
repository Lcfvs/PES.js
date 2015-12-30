/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
var PES;

(function () {
    'use strict';
    
    var base64PES, createWorker, methods, onmessage;
    
    base64PES = 'data:application/javascript;base64,InVzZSBzdHJpY3QiDQp2YXIgJD1zZWxmLGE9ZnVuY3Rpb24obil7dmFyIHIsdCxlLHUsbyxjLGksZixhLGwscA0KcmV0dXJuIHI9ZnVuY3Rpb24obil7cmV0dXJuW10ubWFwLmNhbGwobi5ub3JtYWxpemUoIk5GS0MiKSxmdW5jdGlvbihuKXtyZXR1cm4gbi5jb2RlUG9pbnRBdCgwKX0pfSx0PWZ1bmN0aW9uKG4pe3JldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludC5hcHBseShudWxsLG4pfSxlPWZ1bmN0aW9uKG4pe3ZhciByDQpyZXR1cm4gcj1bXSxuLnNwbGl0KCIiKS5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7MSZlfHxyLnB1c2goMjU2Km4uY2hhckNvZGVBdChlKStuLmNoYXJDb2RlQXQoZSsxKSl9KSxyfSx1PWZ1bmN0aW9uKG4pe3ZhciByDQpyZXR1cm4gcj1bXSxuLmZvckVhY2goZnVuY3Rpb24obil7ci5wdXNoKG4+Pj44LG4lMjU2KX0pLFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxyKX0sbz1mdW5jdGlvbihuLHIsdCxlKXtyZXR1cm4gcj9yKG4pOm5ldyBCdWZmZXIobix0KS50b1N0cmluZyhlKX0sYz1mdW5jdGlvbihuLHIpe3ZhciB0LGUNCmZvcih0PWwobixuKSxlPWZ1bmN0aW9uKCl7dmFyIHUNCnJldHVybiB1PWwodCxuKSx0PXQuY29uY2F0KHUpLHQubGVuZ3RoPnI/dDplfTsiZnVuY3Rpb24iPT10eXBlb2YgZTspZT1lKCkNCnJldHVybiBlfSxpPWZ1bmN0aW9uKG4pe3JldHVybiBuLnJlZHVjZShmdW5jdGlvbihuLHIpe3JldHVybiByPm4/bjpyfSl9LGY9ZnVuY3Rpb24obil7cmV0dXJuIG4ucmVkdWNlKGZ1bmN0aW9uKG4scil7cmV0dXJuIG4+cj9uOnJ9KX0sYT1mdW5jdGlvbihuLHIpe3JldHVybiAxJihpKG4pXmYobilecikmJm4ucmV2ZXJzZSgpLG59LGw9ZnVuY3Rpb24obixyKXtyZXR1cm4gbj1uLnNsaWNlKDApLHI9ci5zbGljZSgwKSxyLmZvckVhY2goZnVuY3Rpb24ocil7dmFyIHQNCnQ9cixuPWEobi5tYXAoZnVuY3Rpb24obil7dmFyIGUNCnJldHVybiBlPSh0K25eciklNjU1MzYsdD1uLGV9KSxyKX0pLG59LHA9ZnVuY3Rpb24obixyKXtyZXR1cm4gbj1uLnNsaWNlKDApLHI9ci5zbGljZSgwKSxyLnJldmVyc2UoKSxyLmZvckVhY2goZnVuY3Rpb24ocil7dmFyIHQNCnQ9cixuPWEobixyKS5tYXAoZnVuY3Rpb24obil7cmV0dXJuIHQ9KChuXnIpLXQrNjU1MzYpJTY1NTM2fSl9KSxufSx7ZW5jcnlwdDpmdW5jdGlvbih0LGUpe3ZhciBpLGYsYSxwDQpyZXR1cm4gaT1yKGUpLGY9cih0KSxhPWMoaSxmLmxlbmd0aCksZj1sKGYsYSkscD11KGYpLG8ocCxuLmJ0b2EsImJpbmFyeSIsImJhc2U2NCIpfSxkZWNyeXB0OmZ1bmN0aW9uKHUsaSl7dmFyIGYsYSxsLHMNCnJldHVybiBmPW8odSxuLmF0b2IsImJhc2U2NCIsImJpbmFyeSIpLGE9cihpKSxsPWUoZikscz1jKGEsbC5sZW5ndGgpLGw9cChsLHMpLHQobCl9fX0oJCkNCiQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsZnVuY3Rpb24oZSl7dmFyIG09ZS5kYXRhOyQucG9zdE1lc3NhZ2Uoe3R5cGU6J3Jlc3VsdCcsZGF0YTphW20ubWV0aG9kXShtLmRhdGEsbS5rZXkpfSl9LCExKTs=';

    createWorker = function createWorker(method, data, encryptionKey, callback) {
        var worker;
        
        worker = new Worker(base64PES);
        worker.callback = callback;
        worker.onmessage = onmessage;
        methods[method].call(worker, data, encryptionKey, callback);
    };

    methods = {
        encrypt: function encrypt(data, encryptionKey) {
            this.postMessage({
                method: 'encrypt',
                data: data,
                key: encryptionKey
            });
        },
        decrypt: function decrypt(data, encryptionKey) {
            this.postMessage({
                method: 'decrypt',
                data: data,
                key: encryptionKey
            });
        }
    };

    onmessage = function onmessage(event) {
        this.terminate();
        this.callback(event.data.data);
    };

    self.PES = {
        encrypt: function encrypt(data, encryptionKey, callback) {
            createWorker('encrypt', data, encryptionKey, callback);
        },
        decrypt: function encrypt(data, encryptionKey, callback) {
            createWorker('decrypt', data, encryptionKey, callback);
        }
    };
}());
