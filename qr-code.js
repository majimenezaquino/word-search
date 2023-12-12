function generateQR() {
    var qr = new QRCode(document.getElementById("qrcode"), {
        text: "http://jindo.dev.naver.com/collie",
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Esperar a que el código QR se genere
    setTimeout(function() {
        var qrCanvas = document.getElementsByTagName('canvas')[0];
        context.drawImage(qrCanvas, 0, 0, 128, 128);

        // Cargar y dibujar la imagen en el centro del código QR
        var img = new Image();
        img.onload = function() {
            var imageSize = 30; // Tamaño de la imagen
            var imagePosition = (128 - imageSize) / 2; // Posición central
            context.drawImage(img, imagePosition, imagePosition, imageSize, imageSize);
        };
        img.src = 'src/01.png'; // Ruta a tu imagen
    }, 500);
};
