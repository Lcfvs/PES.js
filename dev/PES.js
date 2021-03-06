/*
    Copyright 2013 Lcf.vs
    Released under the MIT license
    https://github.com/Lcfvs/PES.js
*/
'use strict';

var PES;

PES = function() {
    
    var
    source,
    url,
    createWorker,
    methods,
    onmessage;
    
    source = '"use strict";var $=self,a=function(n){var r,t,e,u,o,c,i,f,a,l,p;return r=function(n){return[].map.call(n.normalize("NFKC"),function(n){return n.codePointAt(0)})},t=function(n){return String.fromCodePoint.apply(null,n)},e=function(n){var r;return r=[],n.split("").forEach(function(t,e){1&e||r.push(256*n.charCodeAt(e)+n.charCodeAt(e+1))}),r},u=function(n){var r;return r=[],n.forEach(function(n){r.push(n>>>8,n%256)}),String.fromCharCode.apply(null,r)},o=function(n,r,t,e){return r?r(n):new Buffer(n,t).toString(e)},c=function(n,r){var t,e;for(t=l(n,n),e=function(){var u;return u=l(t,n),t=t.concat(u),t.length>r?t:e};"function"==typeof e;)e=e();return e},i=function(n){return n.reduce(function(n,r){return r>n?n:r})},f=function(n){return n.reduce(function(n,r){return n>r?n:r})},a=function(n,r){return 1&(i(n)^f(n)^r)&&n.reverse(),n},l=function(n,r){return n=n.slice(0),r=r.slice(0),r.forEach(function(r){var t;t=r,n=a(n.map(function(n){var e;return e=(t+n^r)%65536,t=n,e}),r)}),n},p=function(n,r){return n=n.slice(0),r=r.slice(0),r.reverse(),r.forEach(function(r){var t;t=r,n=a(n,r).map(function(n){return t=((n^r)-t+65536)%65536})}),n},{encrypt:function(t,e){var i,f,a,p;return i=r(e),f=r(t),a=c(i,f.length),f=l(f,a),p=u(f),o(p,n.btoa,"binary","base64")},decrypt:function(u,i){var f,a,l,s;return f=o(u,n.atob,"base64","binary"),a=r(i),l=e(f),s=c(a,l.length),l=p(l,s),t(l)}}}($);$.addEventListener("message",function(e){var m=e.data;$.postMessage({type:"result",data:a[m.method](m.data,m.key)})},!1);';

    url = URL.createObjectURL(new Blob([source], {
        type:'application/javascript'
    }));
    
    createWorker = function(method, data, key, callback) {
        var
        worker;
        
        worker = new Worker(url);
        worker.callback = callback;
        worker.onmessage = onmessage;
        methods[method].call(worker, data, key, callback);
    };

    methods = {
        encrypt: function(data, key) {
            this.postMessage({
                method: 'encrypt',
                data: data,
                key: key
            });
        },
        decrypt: function(data, key) {
            this.postMessage({
                method: 'decrypt',
                data: data,
                key: key
            });
        }
    };

    onmessage = function(event) {
        this.terminate();
        this.callback(event.data.data);
    };

    return {
        encrypt: function(data, key, callback) {
            createWorker('encrypt', data, key, callback);
        },
        decrypt: function(data, key, callback) {
            createWorker('decrypt', data, key, callback);
        }
    };
}();