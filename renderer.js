console.log("Renderer");
const printPDFBtn = document.getElementById('print-pdf')
console.log("pdf"+ printPDFBtn);
printPDFBtn.addEventListener('click', function (event) {
  ipc.send('print-to-pdf')
})