/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
var PES;
(function () {
    'use strict';
    var base64PES, createWorker, methods, onmessage;
    base64PES = 'data:application/javascript;base64,LypDb3B5cmlnaHQgMjAxMyBMY2YudnMgLSBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgLSBodHRwczovL2dpdGh1Yi5jb20vTGNmdnMvUEVTLmpzKi92YXIgUEVTOyhmdW5jdGlvbigpeyJ1c2Ugc3RyaWN0Ijt2YXIgZSx0LG4scixpLHMsbyx1O2U9ZnVuY3Rpb24oKXt0aGlzLmVuY3J5cHQ9aTt0aGlzLmRlY3J5cHQ9c307dD17InV0Zi04Ijo2NTUzNn07bj1mdW5jdGlvbiBhKGUpe3ZhciB0LG4scjt0PTA7bj1bXTtyPWUubGVuZ3RoO3RyeXt3aGlsZSh0PHIpe24ucHVzaChlLmNoYXJDb2RlQXQodCkpO3QrPTF9fWNhdGNoKGkpe249bi5jb25jYXQoYShlLnN1YnN0cmluZyh0KSkpfXJldHVybiBufTtyPWZ1bmN0aW9uKGUsaSxzLHUpe3ZhciBhLGYsbDtpZihlLmxlbmd0aD09PTApe3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBlbmNyeXB0aW9uIGtleSBsZW5ndGgiKX1hPXV8fCIiO3RyeXt3aGlsZShhLmxlbmd0aDxpKXtmPW4oZSk7bD1uKGF8fGUpO28oZixsLHRbc10sZi5sZW5ndGgtMSwwKTthKz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZil9fWNhdGNoKGMpe2ErPXIoZSxpLHMsYSl9aWYodT09PXVuZGVmaW5lZCl7Zj1uKGUpO2w9bihhKTtvKGYsbCx0W3NdLGYubGVuZ3RoLTEsMCk7YSs9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGYpfXJldHVybiBhfTtpPWZ1bmN0aW9uKGkscyx1KXt2YXIgYSxmO2E9bihpKTtmPW4ocihzLGEubGVuZ3RoLHUpKTtvKGEsZix0W3VdLGEubGVuZ3RoLTEsMCk7cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxhKX07cz1mdW5jdGlvbihpLHMsbyl7dmFyIGEsZjthPW4oaSk7Zj1uKHIocyxhLmxlbmd0aCxvKSk7dShhLGYsdFtvXSwwLGYubGVuZ3RoLTEpO3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsYSl9O289ZnVuY3Rpb24gZihlLHQsbixyLGkpe3ZhciBzLG8sdSxhLGw7cz1lLmxlbmd0aC0xO289dC5sZW5ndGg7YT10W2ldO3RyeXt3aGlsZShpPG8pe2lmKHI9PT1zKXtpZigoTWF0aC5taW4uYXBwbHkobnVsbCxlKV5NYXRoLm1heC5hcHBseShudWxsLGUpXmFebikmMSl7ZS5yZXZlcnNlKCl9fXU9ZVtyXTtsPXIhPT0wP2Vbci0xXTphO2Vbcl09bCt1XmE7aWYoZVtyXT49bil7ZVtyXS09bn1pZihyPT09MCl7cj1zO2krPTE7YT10W2ldfWVsc2V7ci09MX19fWNhdGNoKGMpe2YoZSx0LG4scixpKX1yZXR1cm4gZX07dT1mdW5jdGlvbiBsKGUsdCxuLHIsaSl7dmFyIHMsbyx1LGE7cz1lLmxlbmd0aC0xO3U9dFtpXTt0cnl7d2hpbGUoaT4tMSl7bz1lW3JdO2E9ciE9PTA/ZVtyLTFdOnU7ZVtyXT0oZVtyXV51KS1hO2lmKGVbcl08MCl7ZVtyXSs9bn1pZihyPT09cyl7aWYoKE1hdGgubWluLmFwcGx5KG51bGwsZSleTWF0aC5tYXguYXBwbHkobnVsbCxlKV51Xm4pJjEpe2UucmV2ZXJzZSgpfXI9MDtpLT0xO3U9dFtpXX1lbHNle3IrPTF9fX1jYXRjaChmKXtsKGUsdCxuLHIsaSl9cmV0dXJuIGV9O3NlbGYuUEVTPW5ldyBlfSkoKTtzZWxmLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLGZ1bmN0aW9uKGUpe3ZhciB0LG4scixpO3Q9ZS5kYXRhO249dC5tZXRob2Q7cj10LmRhdGE7aT10LmtleTtzZWxmLnBvc3RNZXNzYWdlKHt0eXBlOiJyZXN1bHQiLGRhdGE6UEVTW25dKHIsaSwidXRmLTgiKX0pfSxmYWxzZSk=';
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