/* eslint-disable */
import React, { Component } from 'react';
import { Globals } from '../globals';
const parameterSettings = {
    hideParameterBlock: true
}
let didMount = true;
let languagesList, languages;
const tooltipLocales = {
    "en-US": { header: "Edit Report", content: "Edit this report in designer" },
    "fr-CA": { header: "Modifier le rapport", content: "Modifier ce rapport dans le concepteur" },
    "de-DE": { header: "Bericht bearbeiten", content: "Bearbeiten Sie diesen Bericht im Designer" },
    "hi-IN": { header: "रिपोर्ट संपादित करें", content: "इस रिपोर्ट को डिज़ाइनर में संपादित करें" },
    "es-ES": { header: "Editar informe", content: "Editar este informe en el diseñador" },
    "nl-NL": { header: "Rapport bewerken", content: "Bewerk dit rapport in de ontwerper" },
    "ko-KR": { header: "보고서 편집", content: "디자이너에서 이 보고서를 편집합니다" },
    "he-IL": { header: "ערוך דוח", content: "ערוך דוח זה במעצב" },
    "ru-RU": { header: "Редактировать отчет", content: "Редактировать этот отчет в дизайнере" }
};

class MultiLanguageReport extends Component {
    render() {
        if (this.props.content !== 'desc') {
            return (
                <div id="r-w-container">
                    <div id="r-w-sample-container">
                        <ej-sample>
                            <BoldReportViewerComponent
                                id="report-viewer"
                                reportServiceUrl={Globals.ServiceURL}
                                reportPath={'multi-language-report.rdl'}
                                toolbarSettings={{
                                    customGroups: window.Globals.TOOLBAR_OPTIONS.customGroups,
                                    toolbars: ej.ReportViewer.Toolbars.All & ~ej.ReportViewer.Toolbars.Vertical 
                                }}
                                toolBarItemClick={Globals.EDIT_REPORT} parameterSettings={parameterSettings}>
                            </BoldReportViewerComponent>
                        </ej-sample>
                    </div>
                    <div id="r-w-property-container">
                        <div id='spinner-container'></div>
                        <div id="r-w-property-title" style={{display: "none"}}>Parameters</div>
                        <div id="r-w-property-languages" className="parameter-property" style={{display: "none"}}>
                            <div id="r-w-property-name-languages">Languages</div>
                            <div id='r-w-property-value-category'>
                                <input type="text" id="languages" />
                            </div>
                        </div>
                        <input type="button" className="r-w-genearte e-control e-btn e-lib e-primary"
                            id="update" onClick={this.loadReport} value="View Report" style={{display: "none"}} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div id="description">
                    <p>
                        This demo showcases a Multi Language Report that allows users to view report in various languages using the React Bold Report Viewer. Select a language from the dropdown and click "View Report" to see the report content in the selected language.
                    </p>
                    <p>
                        Ensure that the report is designed to support multiple languages and that the necessary localization resources are available.
                    </p>
                    <p>
                        For detailed guidance on implementing localization, refer to the <a href="https://help.boldreports.com/embedded-reporting/react-reporting/report-viewer/localization/"
                                                                                                                                        target="_blank" rel="noreferrer">documentation</a>.
                    </p>
                </div>
            );
        }
    }
    componentDidMount() {
        ejs.popups.createSpinner({ target: document.getElementById("spinner-container") })
        ejs.popups.showSpinner(document.getElementById("spinner-container"));
        languagesList = [{ Name: "English", languageId: "en-US" }, { Name: "French", languageId: "fr-CA" }, { Name: "German", languageId: "de-DE" }, { Name: "Hindi", languageId: "hi-IN" }, { Name: "Spanish", languageId: "es-ES" }, { Name: "Dutch", languageId: "nl-NL" }, { Name: "Korean", languageId: "ko-KR" }, { Name: "Hebrew", languageId: "he-IL" }, { Name: "Russian", languageId: "ru-RU" }];
        if(didMount) {
            languages = new ejs.dropdowns.DropDownList({
                dataSource: languagesList,
                fields: {
                    text: "Name",
                    value: "languageId",
                },
                index: 0,
                width: "180px",
                height: "10px",
                showClearButton: false
            });
            languages.appendTo('#languages');
        }
        ejs.popups.hideSpinner(document.getElementById("spinner-container"));
        $("#r-w-property-title, .r-w-genearte").css("display", "block");
        $(".parameter-property").css("display", "inline-flex");
        didMount = false;
    }
    loadReport = () => {
        const reportViewer = $("#report-viewer").boldReportViewer("instance");
        const selectedLanguageId = languages.value.toString();
        const tooltipData = tooltipLocales[selectedLanguageId];
        const selectedLanguage = languagesList.find(lang => lang.languageId === selectedLanguageId);
        const parameters = [{ name: 'Language', labels: [selectedLanguage.Name], values: [selectedLanguage.Name] }];
        reportViewer.model.parameters = parameters;
        reportViewer.reload();
        reportViewer.setModel({'locale': selectedLanguageId});
        const item = reportViewer.model.toolbarSettings.customGroups[0].items[0];
        item.tooltip = {
            header: tooltipData.header,
            content: tooltipData.content
        };
    }
    componentWillUnmount() {
        didMount = true;
    }
}
export default MultiLanguageReport;
