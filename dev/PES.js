/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
var PES;
(function () {
    'use strict';
    var base64PES, createWorker, methods, onmessage;
    base64PES = 'data:application/javascript;base64,dmFyIFBFUzsoZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7dmFyIGUsdCxuLHIsaSxzLG8sdTtlPWZ1bmN0aW9uKCl7dGhpcy5lbmNyeXB0PWk7dGhpcy5kZWNyeXB0PXN9O3Q9eyJ1dGYtOCI6NjU1MzZ9O249ZnVuY3Rpb24gYShlKXt2YXIgdCxuLHI7dD0wO249W107cj1lLmxlbmd0aDt0cnl7d2hpbGUodDxyKXtuLnB1c2goZS5jaGFyQ29kZUF0KHQpKTt0Kz0xfX1jYXRjaChpKXtuPW4uY29uY2F0KGEoZS5zdWJzdHJpbmcodCkpKX1yZXR1cm4gbn07cj1mdW5jdGlvbihlLGkscyx1KXt2YXIgYSxmLGw7aWYoZS5sZW5ndGg9PT0wKXt0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgZW5jcnlwdGlvbiBrZXkgbGVuZ3RoIil9YT11fHwiIjt0cnl7d2hpbGUoYS5sZW5ndGg8aSl7Zj1uKGUpO2w9bihhfHxlKTtvKGYsbCx0W3NdLGYubGVuZ3RoLTEsMCk7YSs9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGYpfX1jYXRjaChjKXthKz1yKGUsaSxzLGEpfWlmKHU9PT11bmRlZmluZWQpe2Y9bihlKTtsPW4oYSk7byhmLGwsdFtzXSxmLmxlbmd0aC0xLDApO2ErPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxmKX1yZXR1cm4gYX07aT1mdW5jdGlvbihpLHMsdSl7dmFyIGEsZjthPW4oaSk7Zj1uKHIocyxhLmxlbmd0aCx1KSk7byhhLGYsdFt1XSxhLmxlbmd0aC0xLDApO3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsYSl9O3M9ZnVuY3Rpb24oaSxzLG8pe3ZhciBhLGY7YT1uKGkpO2Y9bihyKHMsYS5sZW5ndGgsbykpO3UoYSxmLHRbb10sMCxmLmxlbmd0aC0xKTtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGEpfTtvPWZ1bmN0aW9uIGYoZSx0LG4scixpKXt2YXIgcyxvLHUsYSxsO3M9ZS5sZW5ndGgtMTtvPXQubGVuZ3RoO2E9dFtpXTt0cnl7d2hpbGUoaTxvKXtpZihyPT09cyl7aWYoKE1hdGgubWluLmFwcGx5KG51bGwsZSleTWF0aC5tYXguYXBwbHkobnVsbCxlKV5hXm4pJjEpe2UucmV2ZXJzZSgpfX11PWVbcl07bD1yIT09MD9lW3ItMV06YTtlW3JdPWwrdV5hO2lmKGVbcl0+PW4pe2Vbcl0tPW59aWYocj09PTApe3I9cztpKz0xO2E9dFtpXX1lbHNle3ItPTF9fX1jYXRjaChjKXtmKGUsdCxuLHIsaSl9cmV0dXJuIGV9O3U9ZnVuY3Rpb24gbChlLHQsbixyLGkpe3ZhciBzLG8sdSxhO3M9ZS5sZW5ndGgtMTt1PXRbaV07dHJ5e3doaWxlKGk+LTEpe289ZVtyXTthPXIhPT0wP2Vbci0xXTp1O2Vbcl09KGVbcl1edSktYTtpZihlW3JdPDApe2Vbcl0rPW59aWYocj09PXMpe2lmKChNYXRoLm1pbi5hcHBseShudWxsLGUpXk1hdGgubWF4LmFwcGx5KG51bGwsZSledV5uKSYxKXtlLnJldmVyc2UoKX1yPTA7aS09MTt1PXRbaV19ZWxzZXtyKz0xfX19Y2F0Y2goZil7bChlLHQsbixyLGkpfXJldHVybiBlfTtzZWxmLlBFUz1uZXcgZX0pKCk7c2VsZi5hZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIixmdW5jdGlvbihlKXt2YXIgdCxuLHIsaTt0PWUuZGF0YTtuPXQubWV0aG9kO3I9dC5rZXk7aT10LmRhdGE7aWYobj09PSJlbmNyeXB0Iil7aT1idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChlc2NhcGUoUEVTW25dKGksciwidXRmLTgiKSkpKSkucmVwbGFjZSgvSlgoLns2fSkvZywiJDEiKX1lbHNle2k9UEVTW25dKHVuZXNjYXBlKGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoYXRvYihpLnJlcGxhY2UoLyguezZ9KS9nLCJKWCQxIikpKSkpLHIsInV0Zi04Iil9c2VsZi5wb3N0TWVzc2FnZSh7dHlwZToicmVzdWx0IixkYXRhOml9KX0sZmFsc2Up';
    createWorker = function createWorker(method, data, encryptionKey, callback) {
        var worker;
        worker = new Worker(base64PES);
        worker.callback = callback;
        worker.onmessage = onmessage;
        methods[method].call(worker, data, encryptionKey, callback);
    };
    methods = {
        encrypt: function encrypt(data, encryptionKey){
            this.postMessage({
                method: 'encrypt',
                data: data,
                key: encryptionKey
            });
        },
        decrypt: function decrypt(data, encryptionKey){
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
