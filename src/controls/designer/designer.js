/* eslint-disable */
import { React, Component } from 'react';
import { Header } from './../../common/header/header';
import rdlcData from '../../rdlcData';
import data from '../../samples.json';
import jquery from 'jquery';
window.$ = window.jQuery = jquery;

const samples = data.samples;

var reportItemExtensions = [{
  name: 'barcode',
  className: 'EJBarcode',
  imageClass: 'customitem-barcode',
  displayName: '1D Barcode',
  category: 'Barcodes',
  toolTip: {
    requirements: 'Add a report item to the designer area.',
    description: 'Display the barcode lines as report item.',
    title: 'Barcode'
  }
}, {
  name: 'matrixbarcode',
  className: 'EJQRBarcode',
  imageClass: 'customitem-qrbarcode',
  displayName: '2D Barcode',
  category: 'Barcodes',
  toolTip: {
    requirements: 'Add a report item to the designer area.',
    description: 'Display the barcode lines as report item.',
    title: '2D Barcode'
  }
}, {
  name: 'ESignature',
  className: 'EJSignature',
  imageClass: 'customitem-signature',
  displayName: 'Electronic',
  category: 'Signatures',
  toolTip: {
      requirements: 'Add a report item to the designer area.',
      description: 'This report item is used to add a graphic signature.',
      title: 'Electronic Signature'
  }
}, {
  name: 'PDFSignature',
  className: 'EJPDFSignature',
  imageClass: 'customitem-pdfsignature',
  displayName: 'PDF',
  category: 'Signatures',
  toolTip: {
      requirements: 'Add a report item to the designer area.',
      description: 'This report item is used to add a digital PDF signature.',
      title: 'PDF Signature'
  }
}, {
  name: 'Shape',
  className: 'EJShape',
  imageClass: 'customitem-shape',
  displayName: 'Shape',
  category: 'Shapes',
  toolTip: {
      requirements: 'Add a report item to the designer area',
      description: 'Display the different types of shapes as report item',
      title: 'Shapes'
  }
}, {
  name: 'pdfdocument',
  className: 'EJPdfDocument',
  imageClass: 'customitem-pdfdocument',
  displayName: 'PDF',
  category: 'Documents',
  toolTip: {
      requirements: 'Add a report item to the designer area.',
      description: 'Display the pdf document content in the report',
      title: 'PDF'
  },
  allowHeaderFooter: false
}, {
  name: 'htmldocument',
  className: 'EJHtmlDocument',
  imageClass: 'customitem-htmldocument',
  displayName: 'Html',
  category: 'Documents',
  toolTip: {
      requirements: 'Add a report item to the designer area.',
      description: 'This report item used to process the html markup text and url',
      title: 'Html'
  },
}];

function DESIGNER_TOOLBAR_RENDERING(args) {
  if (args?.target && $(args.target)?.hasClass('e-rptdesigner-toolbarcontainer')) {
    if (args.action === 'beforeCreate') {
      args.items.splice(0, 0, {
        GroupName: 'customfileactionitems',
        GroupId: 'designer_custom_fileaction_group',
        Items: [
          {
              prefixIcon: 'b-toolbar-item e-rptdesigner-toolbar-icon e-toolbarfonticonbasic e-rptdesigner-toolbar-new',
              tooltipText: 'New',
              id: 'designer_custom_toolbar_btn_new',
              htmlAttributes: {
                id: 'designer_custom_toolbar_new',
                'aria-label': 'New'
              }
            },
          {
            prefixIcon: 'b-toolbar-item e-toolbarfonticonbasic e-rptdesigner-toolbar-save',
            tooltipText: 'Save',
            id: 'designer_custom_toolbar_btn_save',
            htmlAttributes: {
              id: 'designer_custom_toolbar_save',
              'aria-label': 'Save'
            }
          }
        ]
      });
    }
  }
}

function DESIGNER_TOOLBAR_CLICK(args) {
  if (args.click === 'Save') {
    args.cancel = true;
    $('#designer').data('boldReportDesigner').saveToDevice();
  }
}

function getReportName() {
  var reportName = window.location.href.includes('report-name') ? /[\\?&]report-name=([^&#]*)/.exec(window.location)[1] : undefined;
  return reportName;

};

let isServerReport;
class Designer extends Component {
  controlCreate = () => {
    var reportName = getReportName();
    var designerInst = $('#designer').data('boldReportDesigner');
    if (this.props.reportType === 'rdlc') {
      designerInst.setModel({
        reportType: 'RDLC',
        previewReport: this.previewReport,
        previewOptions: {
          exportItemClick: Globals.exportItemClick,
          toolbarSettings: {
            items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Find
          }
        }
      });
    }
    else {
      designerInst.setModel({
        previewOptions: {
          exportItemClick: Globals.exportItemClick,
          toolbarSettings: {
            items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Find
          }
        }
      });
    }
    if (reportName) {
      designerInst.openReport(reportName.indexOf("external-parameter-report") !== -1 ? "product-line-sales.rdl" : reportName.indexOf("parameter-customization") !== -1 ? "product-line-sales.rdl" : reportName);
    }
    if (reportName == "load-large-data.rdl") {
      designerInst.setModel({
        previewOptions: {
          toolbarSettings: {
            items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Export & ~ej.ReportViewer.ToolbarItems.Print,
            toolbars: ej.ReportViewer.Toolbars.All & ~ej.ReportViewer.Toolbars.Vertical
          }
        }
      });
    }
    if (reportName == "powerpoint-report.rdl") {
      designerInst.setModel({
          previewOptions: {
            exportSettings: {
              exportOptions: ej.ReportViewer.ExportOptions.PPT
            }
          }
      });
    }
  }
  onAjaxBeforeLoad = (args) => {
    args.data = JSON.stringify({ reportType: this.props.reportType === 'rdlc' ? 'RDLC' : 'RDL' });
  }
  componentDidMount() {
    if (Globals.DESTROY_REPORT) {
      this.destroyReportControls();
    } else {
      Globals.DESTROY_REPORT = true;
    }
  }
  destroyReportControls() {
    const reportViewerElement = document.querySelector('.e-reportviewer.e-js');
    if (reportViewerElement) { $(reportViewerElement).data('boldReportViewer')._ajaxCallMethod("ClearCache", "_clearCurrentServerCache", false); }
  }
  onReportOpened(args) {
    isServerReport = args.isServerReport;
  }
  previewReport(args) {
    if (isServerReport) {
      let reportPath = args.model.reportPath;
      reportPath = reportPath.indexOf('//') !== -1 ? reportPath.substring(2) : reportPath
      let reportNameWithoutExt = reportPath.split(".rdlc")[0];
      if (reportNameWithoutExt != "load-large-data") {
        var datasource = rdlcData[reportNameWithoutExt];
        args.dataSets = datasource;
      }
      args.cancelDataInputDialog = true;
    }
  }
  findSampleName(reportName) {
    var currentIndex = Object.values(samples).indexOf(samples.find(sample => sample.routerPath === reportName));
    return samples[currentIndex].sampleName;
  }
  render() {
    var url = window.location.host;
    const title = (getReportName() ? this.findSampleName(getReportName().replace(/.rdl.*/g, '')) + " | " : '') + (this.props.reportType === 'rdlc' ? 'RDLC' : 'RDL') + ' Sample | React Report Designer';
    const titleWithBoldReports = (title.length < 45) ? title + ' | Bold Reports' : title;
    document.title = titleWithBoldReports;
    document.querySelector('meta[name="description"]').setAttribute('content', "The React Bold Report Designer allows the end-users to arrange/customize the reports appearance in browsers. It helps to edit the " + (getReportName() ? this.findSampleName(getReportName().replace(/.rdl.*/g, '')) : 'RDL Sample') + " for customer's application needs.");
    document.querySelector('meta[property="og:title"]').setAttribute('content', titleWithBoldReports);
    return (
      <div>
        <Header />
        <div className='ej-preview-content'>
          <BoldReportDesignerComponent
            id="designer"
            serviceUrl={Globals.DesignerServiceURL}
            create={this.controlCreate}
            ajaxBeforeLoad={this.onAjaxBeforeLoad}
            toolbarRendering={DESIGNER_TOOLBAR_RENDERING}
            toolbarClick={DESIGNER_TOOLBAR_CLICK}
            reportOpened={this.props.reportType === 'rdlc' ? this.onReportOpened : ''}
            reportItemExtensions={reportItemExtensions}
            permissionSettings={
              (url.indexOf("demos.boldreports.com") !== -1 ? { dataSource: ej.ReportDesigner.Permission.All & ~ej.ReportDesigner.Permission.Create } : { dataSource: ej.ReportDesigner.Permission.All })
            }
            toolbarSettings={{
              items: ej.ReportDesigner.ToolbarItems.All & ~ej.ReportDesigner.ToolbarItems.New & ~ej.ReportDesigner.ToolbarItems.Save & ~ej.ReportDesigner.ToolbarItems.Open
            }}
          >
          </BoldReportDesignerComponent>
        </div>
      </div>
    );
  }
}

export { Designer };
