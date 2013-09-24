/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
var PES;

(function () {
    'use strict';
    
    var base64PES, createWorker, methods, onmessage;
    
    base64PES = 'data:application/javascript;base64,dmFyIFBFUzsoZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7dmFyIGUsdCxuLHIsaSxzLG8sdTtlPWZ1bmN0aW9uKCl7dGhpcy5lbmNyeXB0PWk7dGhpcy5kZWNyeXB0PXN9O3Q9eyJ1dGYtOCI6NjU1MzZ9O249ZnVuY3Rpb24gYShlKXt2YXIgdCxuLHI7dD0wO249W107cj1lLmxlbmd0aDt0cnl7d2hpbGUodDxyKXtuLnB1c2goZS5jaGFyQ29kZUF0KHQpKTt0Kz0xfX1jYXRjaChpKXtuPW4uY29uY2F0KGEoZS5zdWJzdHJpbmcodCkpKX1yZXR1cm4gbn07cj1mdW5jdGlvbihlLGkscyx1KXt2YXIgYSxmLGw7aWYoZS5sZW5ndGg9PT0wKXt0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgZW5jcnlwdGlvbiBrZXkgbGVuZ3RoIil9YT11fHwiIjt0cnl7d2hpbGUoYS5sZW5ndGg8aSl7Zj1uKGUpO2w9bihhfHxlKTtvKGYsbCx0W3NdLGYubGVuZ3RoLTEsMCk7YSs9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGYpfX1jYXRjaChjKXthKz1yKGUsaSxzLGEpfWlmKHU9PT11bmRlZmluZWQpe2Y9bihlKTtsPW4oYSk7byhmLGwsdFtzXSxmLmxlbmd0aC0xLDApO2ErPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxmKX1yZXR1cm4gYX07aT1mdW5jdGlvbihpLHMsdSl7dmFyIGEsZjthPW4oaSk7Zj1uKHIocyxhLmxlbmd0aCx1KSk7byhhLGYsdFt1XSxhLmxlbmd0aC0xLDApO3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsYSl9O3M9ZnVuY3Rpb24oaSxzLG8pe3ZhciBhLGY7YT1uKGkpO2Y9bihyKHMsYS5sZW5ndGgsbykpO3UoYSxmLHRbb10sMCxmLmxlbmd0aC0xKTtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGEpfTtvPWZ1bmN0aW9uIGYoZSx0LG4scixpKXt2YXIgcyxvLHUsYSxsLGMsaCxwLGQ7cz1lLmxlbmd0aDtvPXMtMTt1PXQubGVuZ3RoO2w9dFtpXTt0cnl7d2hpbGUoaTx1KXtpZihyPT09byl7aD1NYXRoLm1pbi5hcHBseShudWxsLGUpO3A9TWF0aC5tYXguYXBwbHkobnVsbCxlKTtkPShwLWgpJXM7ZS5zcGxpY2UuYmluZChlLDAscykuYXBwbHkoZSxlLnNsaWNlKGQpLmNvbmNhdChlLnNsaWNlKDAsZCkpKTtpZigoaF5wXmxebikmMSl7ZS5yZXZlcnNlKCl9fWE9ZVtyXTtjPXIhPT0wP2Vbci0xXTpsO2Vbcl09YythXmw7aWYoZVtyXT49bil7ZVtyXS09bn1pZihyPT09MCl7cj1vO2krPTE7bD10W2ldfWVsc2V7ci09MX19fWNhdGNoKHYpe2YoZSx0LG4scixpKX1yZXR1cm4gZX07dT1mdW5jdGlvbiBsKGUsdCxuLHIsaSl7dmFyIHMsbyx1LGEsZixjLGgscDtzPWUubGVuZ3RoO289cy0xO2E9dFtpXTt0cnl7d2hpbGUoaT4tMSl7dT1lW3JdO2Y9ciE9PTA/ZVtyLTFdOmE7ZVtyXT0oZVtyXV5hKS1mO2lmKGVbcl08MCl7ZVtyXSs9bn1pZihyPT09byl7Yz1NYXRoLm1pbi5hcHBseShudWxsLGUpO2g9TWF0aC5tYXguYXBwbHkobnVsbCxlKTtpZigoY15oXmFebikmMSl7ZS5yZXZlcnNlKCl9cD1zLShoLWMpJXM7ZS5zcGxpY2UuYmluZChlLDAscykuYXBwbHkoZSxlLnNsaWNlKHApLmNvbmNhdChlLnNsaWNlKDAscCkpKTtyPTA7aS09MTthPXRbaV19ZWxzZXtyKz0xfX19Y2F0Y2goZCl7bChlLHQsbixyLGkpfXJldHVybiBlfTtzZWxmLlBFUz1uZXcgZX0pKCk7c2VsZi5hZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIixmdW5jdGlvbihlKXt2YXIgdCxuLHIsaTt0PWUuZGF0YTtuPXQubWV0aG9kO3I9dC5rZXk7aT10LmRhdGE7aWYobj09PSJlbmNyeXB0Iil7aT1idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChlc2NhcGUoUEVTW25dKGksciwidXRmLTgiKSkpKSkucmVwbGFjZSgvSlgoLns2fSkvZywiJDEiKX1lbHNle2k9UEVTW25dKHVuZXNjYXBlKGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoYXRvYihpLnJlcGxhY2UoLyguezZ9KS9nLCJKWCQxIikpKSkpLHIsInV0Zi04Iil9c2VsZi5wb3N0TWVzc2FnZSh7dHlwZToicmVzdWx0IixkYXRhOml9KX0sZmFsc2Up';

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
