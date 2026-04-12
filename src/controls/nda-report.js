/* eslint-disable */
import React, { Component } from 'react';
import { Globals } from '../globals';

class NDAReport extends Component {
    render() {
        if (this.props.content !== 'desc') {
            return (
                <BoldReportViewerComponent
                    id="report-viewer"
                    reportServiceUrl={Globals.ServiceURL}
                    reportPath={'nda-report.rdl'}
                    toolbarSettings={Globals.TOOLBAR_OPTIONS}
                    toolBarItemClick={Globals.EDIT_REPORT}>
                </BoldReportViewerComponent>)
        }
        else {
            return (
                <div id="description">
                    <p>
                        This sample demonstrates how to showcase PDF digital signature functionality in Bold Reports using a Non-Disclosure Agreement (NDA) document. It highlights secure signing and verification features for professional agreements.
                    </p>
                    <ul>
                        <li>Illustrates PDF digital signature integration within reports.</li>
                        <li>Uses a real-world NDA template for practical demonstration.</li>
                        <li>Shows how signatures, names, dates, and locations are captured in the report item.</li>
                    </ul>
                    <p>
                        More information about the PDF signature report item can be found in this <a
                            href="https://help.boldreports.com/enterprise-reporting/designer-guide/report-designer/report-items/signature/design-report-with-pdf-signature/"
                            target="_blank" rel="noreferrer">documentation</a> section.
                    </p>
                </div>
            );
        }
    }
}
export default NDAReport;