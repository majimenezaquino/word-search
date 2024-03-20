document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("donwload_pdf")){
        document.getElementById("donwload_pdf").addEventListener("click", donwloadPDF);
    }
    
});
function donwloadPDF() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let currentPage = parseInt(urlParams.get('page')) || 1;
    console.log('Descargando PDF...');
    const contenido = document.getElementById('contenido-para-pdf');
    html2canvas(contenido, {
        scale: 2,
        logging: true,
        useCORS: true
    }).then(canvas => {
        const imgWidth = 8.5;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const pageHeight = 11;
        let heightLeft = imgHeight;
        let position = 0;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'in', 'letter');

        while (heightLeft > 0) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            if (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight;
            }
        }
        pdf.save(`${currentPage} result.pdf`);
    });
}
