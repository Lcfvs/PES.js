(function () {
    var gEBI, dataTextarea, keyInput, methodSelect, encryptButton, decryptButton;
    
    gEBI = document.getElementById;
    dataTextarea = gEBI('dataTextarea');
    keyInput = gEBI('keyInput');
    methodSelect = gEBI('methodSelect');
    encryptButton = gEBI('encrypt');
    decryptButton = gEBI('decrypt');
    
    encryptButton.onclick = decryptButton.onclick = function (event) {
        var method;
        
        if (keyInput.value !== '') {
            method = this.id;
            
            PES[method](dataTextarea.value, keyInput.value, function(data) {
                var result;
                
                if (method === encrypt) {
                    result = btoa(unescape(encodeURIComponent(data)));    
                } else {
                    result = decodeURIComponent(escape(atob(data)));
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
