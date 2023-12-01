document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("donwload_pdf").addEventListener("click", donwloadPDF);
});


function donwloadPDF() {
    const contenido = document.getElementById('contenido-para-pdf');
    html2canvas(contenido, {
        scale: 2,
        logging: true,
        useCORS: true
    }).then(canvas => {
        const imgWidth = 8.5; // Ancho de la página en pulgadas
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const pageHeight = 11;  // Altura de la página en pulgadas
        let heightLeft = imgHeight;
        let position = 0;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'in', 'letter');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('documento.pdf');
    });
}