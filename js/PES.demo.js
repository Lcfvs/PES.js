(function () {
    var dataTextarea, keyInput, methodSelect, encryptButton, decryptButton;
    dataTextarea = document.getElementById('dataTextarea');
    keyInput = document.getElementById('keyInput');
    methodSelect = document.getElementById('methodSelect');
    encryptButton = document.getElementById('encrypt');
    decryptButton = document.getElementById('decrypt');
    encryptButton.onclick = decryptButton.onclick = function (event) {
        if (keyInput.value !== '') {
            PES[this.id](dataTextarea.value, keyInput.value, function(result) {
                dataTextarea.value = result;
            });
        } else {
            alert('Invalid encryption key');
        }
        event.preventDefault();
        event.returnValue = false;
        return false;
    };
}());
