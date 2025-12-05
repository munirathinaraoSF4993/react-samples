const gulp = require('gulp');
var shelljs = require('shelljs');
const fs = require('fs');

const extensionsAssets = ['images', 'barcode.reportitem.css', 'barcode.reportitem.js', 'qrbarcode.reportitem.js', 'signature.reportitem.css','signature.dialog.css','signature.reportitem.js','signature.dialog.js','shape.reportitem.css','shape.reportitem.js','document.reportitem.css','pdfdocument.reportitem.js','htmldocument.reportitem.js', 'pdf.signature.reportitem.css', 'pdf.signature.reportitem.js'];
const extensionsItemSrcDir = 'node_modules/@boldreports/javascript-reporting-extensions/';
const extensionsItemDir = './src/controls/extensions/report-item-extensions/';
const extensionsExportTemp = {
    '1D': 'export { EJBarcode };',
    '2D': 'export { EJQRBarcode };',
    'signature': 'export { EJSignature }',
    'signatureDialog': 'export { SignatureDialog }',
    'shape': 'export { EJShape }',
    'pdfDocument': 'export { EJPdfDocument }',
    'htmlDocument': 'export { EJHtmlDocument }',
    'pdfSignature': 'export { EJPDFSignature }'
}

gulp.task('copy-src-assets', function (done) {
    shelljs.mkdir(`${process.cwd()}/public/report-viewer`);
    copyFile(`${process.cwd()}/src/controls/*.js`, `${process.cwd()}/public/report-viewer/`);
    done();
});

gulp.task('copy-extensions-assets', (done) => {
    shelljs.mkdir('-p',`${process.cwd()}/src/controls/extensions/report-item-extensions/`);
    extensionsAssets.forEach(file => {
        copyFile(`${process.cwd()}/${extensionsItemSrcDir + file}`, extensionsItemDir);
    })
    done();
})

gulp.task('update-extensions-export', (done) => {
    const files = {
        'barcode': ['barcode.reportitem.js', '1D'],
        'qrbarcode': ['qrbarcode.reportitem.js', '2D'],
        'signature': ['signature.reportitem.js', 'signature'],
        'signatureDialog': ['signature.dialog.js', 'signatureDialog'],
        'shape': ['shape.reportitem.js', 'shape'],
        'pdfDocument': ['pdfdocument.reportitem.js', 'pdfDocument'],
        'htmlDocument': ['htmldocument.reportitem.js', 'htmlDocument'],
        'pdfSignature': ['pdf.signature.reportitem.js', 'pdfSignature']
    };
    const updateFile = (key, [filename, exportKey]) => {
        const filePath = `${extensionsItemDir}${filename}`;
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes(extensionsExportTemp[exportKey])) {
                fs.writeFileSync(filePath, `${content}\n${extensionsExportTemp[exportKey]}`);
            }
        } else {
            console.log(`!!!... The ${key} file not found in ${extensionsItemDir} ...!!!`);
            process.exit(1);
        }
    };
    Object.entries(files).forEach(([key, value]) => updateFile(key, value));
    done();
});

function copyFile(from , to){
    shelljs.cp('-r', from, to);
}