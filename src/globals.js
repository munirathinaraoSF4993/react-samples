import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import ProductLineSales from './controls/product-line-sales';
import CompanySales from './controls/company-sales';
import ProductCatalog from './controls/product-catalog';
import SalesByYear from './controls/sales-by-year';
import LoadLargeData from './controls/load-large-data';
import ConsolidatedBalanceSheet from './controls/consolidated-balance-sheet';
import MailMerge from './controls/mail-merge';
import SalesReport from './controls/sales-report';
import TerritorySales from './controls/territory-sales';
import Barcode from './controls/barcode';
import TicketsSalesAnalysis from './controls/tickets-sales-analysis';
import ConditionalRowFormatting from './controls/conditional-row-formatting';
import WebsiteVisitorAnalysis from './controls/website-visitor-analysis';
import CustomerSupportAnalysis from './controls/customer-support-analysis';
import PatientExperienceAnalysis from './controls/patient-experience-analysis';
import PersonalExpenseAnalysis from './controls/personal-expense-analysis';
import NorthwindProductsandSuppliersReport from './controls/northwind-products-suppliers-report';
import SalesOrderDetail from './controls/sales-order-detail';
import Invoice from './controls/invoice';
import GroupingAggregate from './controls/grouping-aggregate';
import ProductDetails from './controls/product-details';
import Paystub from './controls/paystub';
import DynamicChartSeries from './controls/dynamic-chart-series';
import DataBar from './controls/data-bar';
import SparkLine from './controls/spark-line';
import DynamicColumns from './controls/dynamic-columns';
import ExternalParameterReport from './controls/external-parameter-report';
import ParameterCustomization from './controls/parameter-customization';
import SubReport from './controls/sub-report';
import PowerPointReport from './controls/powerpoint-report';
import TranscriptReport from './controls/transcript-report';
import CMRReport from './controls/cmr-report';
import InfographicsReport from './controls/infographics-report';
import DynamicLogos from './controls/dynamic-logos';
import HRPayroll from './controls/hr-payroll';
import MultiLanguageReport from './controls/multi-language-report';
import rdlcData from './rdlcData'

window.React = React;
window.createReactClass = createReactClass;
window.ReactDOM = ReactDOM;

var TOOLBAR_OPTIONS = {
    showToolbar: true,
    items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Find,
    customGroups: [{
        items: [{
            type: 'Default',
            cssClass: "e-icon e-edit e-reportviewer-icon ej-webicon CustomGroup",
            prefixIcon: "e-viewer-icons edit",
            id: "edit-report",
            // Need to add the proper header and content once, the tool tip issue resolved.
            tooltip: {
                header: 'Edit Report',
                content: 'Edit this report in designer'
            }
        }],
        // Need to remove the css (e-reportviewer-toolbarcontainer ul.e-ul:nth-child(4)) once the group index issue resolved
        cssClass: "e-show"
    }]
};

var EXPORT_OPTIONS = {
    exportOptions: ej.ReportViewer.ExportOptions.PPT
}

function EDIT_REPORT(args) {
    if (args.value === "edit-report") {
        var reportPath = location.href.lastIndexOf('external-parameter-report') !== -1 ? 
        "external-parameter-report" : location.href.lastIndexOf('parameter-customization') !== -1 ? 'parameter-customization' : args.model.reportPath.toString();
        const ReportDesignerPath = reportPath.indexOf('.rdlc') !== -1 ? '#/report-designer/rdlc' : '#/report-designer';
        var editReportPath = ReportDesignerPath + "/?report-name=" + reportPath;
        window.open(editReportPath);
    }
}

var ServiceURL = '/services/api/ReportViewerWebApi';
var DesignerServiceURL = '/services/api/ReportDesignerWebApi';

const SampleComponents = {
    ProductLineSales: ProductLineSales,
    CompanySales: CompanySales,
    MailMerge: MailMerge,
    SalesReport: SalesReport,
    TerritorySales: TerritorySales,
    ConditionalRowFormatting: ConditionalRowFormatting,
    Barcode: Barcode,
    CustomerSupportAnalysis: CustomerSupportAnalysis,
    TicketsSalesAnalysis: TicketsSalesAnalysis,
    WebsiteVisitorAnalysis: WebsiteVisitorAnalysis,
    PatientExperienceAnalysis: PatientExperienceAnalysis,
    PersonalExpenseAnalysis: PersonalExpenseAnalysis,
    NorthwindProductsandSuppliersReport: NorthwindProductsandSuppliersReport,
    SalesOrderDetail: SalesOrderDetail,
    Invoice: Invoice,
    ProductCatalog: ProductCatalog,
    SalesByYear: SalesByYear,
    GroupingAggregate: GroupingAggregate,
    ProductDetails: ProductDetails,
    LoadLargeData: LoadLargeData,
    ConsolidatedBalanceSheet: ConsolidatedBalanceSheet,
    Paystub: Paystub,
    DynamicChartSeries: DynamicChartSeries,
    DataBar: DataBar,
    SparkLine: SparkLine,
    DynamicColumns: DynamicColumns,
    ExternalParameterReport: ExternalParameterReport,
    ParameterCustomization: ParameterCustomization,
    SubReport: SubReport,
    PowerPointReport: PowerPointReport,
    TranscriptReport: TranscriptReport,
    CMRReport: CMRReport,
    InfographicsReport: InfographicsReport,
    DynamicLogos: DynamicLogos,
    HRPayroll: HRPayroll,
    MultiLanguageReport: MultiLanguageReport
}

function onReportLoaded(args) {
    //console.log(args.model.reportPath + "Arguments");
    let reportNameWithoutExt = args.model.reportPath.split(".")[0];
    reportNameWithoutExt = reportNameWithoutExt.substr(reportNameWithoutExt.lastIndexOf("/") + 1, reportNameWithoutExt.length);
    let reportObj = window.$('#report-viewer').data("boldReportViewer");
    //console.log(rdlcData[reportNameWithoutExt])
    reportObj.model.dataSources = rdlcData[reportNameWithoutExt];
}

global.DESTROY_REPORT = true;

function exportItemClick() {
    global.DESTROY_REPORT = false;
}

const Globals = {
    TOOLBAR_OPTIONS: TOOLBAR_OPTIONS,
    EXPORT_OPTIONS: EXPORT_OPTIONS,
    EDIT_REPORT: EDIT_REPORT,
    ServiceURL: ServiceURL,
    DesignerServiceURL: DesignerServiceURL,
    SampleComponents: SampleComponents,
    onReportLoaded: onReportLoaded,
    exportItemClick: exportItemClick,
    DESTROY_REPORT: global.DESTROY_REPORT,
}

window.Globals = Globals;

export { Globals };
