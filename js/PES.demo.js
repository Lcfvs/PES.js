(function () {
    var gEBI, dataTextarea, keyInput, methodSelect, encryptButton, decryptButton;
    
    gEBI = function gEBI(id) {
        return document.getElementById(id);
    };
    
    dataTextarea = gEBI('dataTextarea');
    keyInput = gEBI('keyInput');
    methodSelect = gEBI('methodSelect');
    encryptButton = gEBI('encrypt');
    decryptButton = gEBI('decrypt');
    
    encryptButton.onclick = decryptButton.onclick = function (event) {
        var data, method;
        
        data = dataTextarea.value;
        
        if (keyInput.value !== '') {
            method = this.id;
                
            if (method === 'decrypt') {
                data = unescape(decodeURIComponent(escape(atob(data))));
            }
            
            PES[method](data, keyInput.value, function(data) {
                var result;
                
                result = data;
                
                if (method === 'encrypt') {
                    result = btoa(unescape(encodeURIComponent(escape(result))));    
                }
                
                dataTextarea.value = result;
            });
        } else {
            setTimeout(function () {
                alert('Invalid encryption key');
            });
        }
        
        event.preventDefault();
        event.returnValue = false;
        
        return false;
    };
}());
