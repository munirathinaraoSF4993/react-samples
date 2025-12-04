import { React, Component } from 'react';
import { Header } from './../header/header';
import Sidebar from './../sidebar/sidebar';
import { Link } from 'react-router-dom';
import data from './../../samples.json';
import Prism from 'prismjs';
import { Globals } from '../../globals';
import axios from 'axios';

const samples = data.samples;
const bannerData = data.banner;
class MainContentSample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDemoActive: true, isSourceActive: false, isDescActive: false
    }
  }
  DemoToggle = () => {
    this.setState({ isDemoActive: true, isSourceActive: false, isDescActive: false });
  };
  SourceActive = () => {
    this.setState({ isDemoActive: false, isSourceActive: true, isDescActive: false });
  };
  DescActive = () => {
    this.setState({ isDemoActive: false, isSourceActive: false, isDescActive: true });
  };
  onResize() {
    this.setReportsHeight();
    this.updateTab();
    this.updateMobileOverlay();
  }
  ViewComponent = (componentName, toView) => {
    var SampleComponent = Globals.SampleComponents[componentName];
    return <SampleComponent content={toView} />
  }
  navigateNextOrPrev = (reportName, nextOrPrev) => {
    var previousOrNextSample = this.findSample(reportName, nextOrPrev);
    window.location.hash = `/report-viewer/${previousOrNextSample.routerPath}/`;
  }
  findSample(reportName, nextOrPrev) {
    var currentIndex = Object.values(samples).indexOf(samples.find(sample => sample.sampleName === reportName));
    currentIndex = nextOrPrev === 'next' ? (currentIndex === samples.length - 1 ? 0 : ++currentIndex) : nextOrPrev === 'previous' ? (currentIndex === 0 ? samples.length - 1 : --currentIndex) : 0;
    return samples[currentIndex];
  }
  newWindow = () => {
    window.open(window.location.href + `preview/`, "_blank", "noreferrer");
  }
  setReportsHeight() {
    var style = document.getElementById('reports-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'reports-style';
      document.body.appendChild(style);
    }
    style.textContent = `ej-sample{
            display: flex;
            overflow: hidden;
            min-height: 600px
          }
          #report-viewer {
            height: auto !important;
            width: 100% !important;
          }
          #report-viewer_viewerContainer {
            overflow-y: hidden;
            min-height: 600px;
            height: auto !important;
          }
          #report-viewer_viewerContainer .e-image, #report-viewer_loadingIndicator_WaitingPopup .e-text {
            top: 230px !important;
          }
          #report-viewer_loadingIndicator_WaitingPopup {
            min-height: 600px !important;
          }`;
  }
  componentDidUpdate() {
    this.setReportsHeight();
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  updateTab() {
    let sourceTab = document.querySelector('.ej-nav-item.source-tab');
    let descTab = document.querySelector('.ej-nav-item.desc-tab');
    if (window.matchMedia('(max-width:850px)').matches) {
      $('#parentTab li:first-child a').tab = 'show';
      sourceTab.classList.add('e-hidden');
      // descTab.classList.add('e-hidden');
    } else {
      if (sourceTab.classList.contains('e-hidden')) {
        sourceTab.classList.remove('e-hidden');
        // descTab.classList.remove('e-hidden');
      }
    }
  }

  updateMobileOverlay() {
    let mobileOverlay = document.querySelector('.mobile-overlay');
    let mobileSideBar = document.querySelector('ej-sidebar');
    if (!window.matchMedia('(max-width:550px)').matches) {
      mobileSideBar.classList.remove('ej-toc-mobile-slide-left');
      mobileOverlay.classList.add('e-hidden');
    }
  }

  componentDidMount() {
    this.getSource();
    this.setReportsHeight();
  }
  getSource() {
    axios.get(`report-viewer/${this.props.report.routerPath}.js`).then(response => {
      var sourceData = response.data.toString().match(/(class.*{([^]*)BoldReportViewerComponent>)/g)[0].replace(/if.*[^{]/g, '').replace(/(render.*([\n\D]*)return \()/, 'render() {\n\t return (') + ")\n\t}\n}";
      sourceData = Prism.highlight(sourceData, Prism.languages.js)
      var sourceTabchildTabContainer = document.getElementById('childTabContainer');
      if (sourceTabchildTabContainer)
        sourceTabchildTabContainer.getElementsByClassName('js-content')[0].innerHTML = sourceData;
    })
  }
  dontGoToLink(e) {
    e.preventDefault();
  }
  render() {
    const componentName = this.props.report.sampleName.replace(/\s/g, '');
    const title = this.props.report.sampleName + ' | React Report Viewer';
    const titleWithBoldReports = (title.length < 45) ? title + ' | Bold Reports' : title;
    document.title = titleWithBoldReports;
    document.querySelector('meta[name="description"]').setAttribute('content', this.props.report.metaData.description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', titleWithBoldReports);
    return (
      <div>
        <Header isViewer="true" />
        <div className={`ej-main-parent-content`}>
          <Sidebar onClick={this.DemoToggle.bind(this)} />
          <div className="ej-main-child-content">
            <div>
              <ej-maincontent>
                <div className="ej-main-body-content">
                  <h1 className="ej-title">{this.props.report.sampleName}</h1>
                  <p className="ej-meta-description">{this.props.report.metaData.description}</p>
                  <div id="parentTabContainer">
                    <ul className="nav ej-nav-header" id="parentTab" role="tablist">
                      <li className="ej-nav-item" onClick={this.DemoToggle}>
                        <Link to={'#demo'} data-bs-toggle="tab" role="tab" aria-selected="true" onClick={this.dontGoToLink} className={`${this.state.isDemoActive ? 'active' : ''}`}>
                          <span className="ej-sb-icons ej-demo-icon"></span><span>DEMO</span>
                        </Link >
                      </li>
                      <li className="ej-nav-item source-tab" onClick={() => { this.SourceActive(); this.getSource(); }} >
                        <Link to={'#source'} data-bs-toggle="tab" role="tab" aria-selected="false" onClick={this.dontGoToLink} className={`${this.state.isSourceActive ? 'active' : ''}`}>
                          <span className="ej-sb-icons ej-source-icon"></span><span>SOURCE</span>
                        </Link>
                      </li>
                      {/*<li className="ej-nav-item desc-tab" onClick={this.DescActive}>
                        <Link to={'#description'} data-bs-toggle="tab" role="tab" aria-selected="false" onClick={this.dontGoToLink} className={`${this.state.isDescActive ? 'active' : ''}`} >
                          <span className="ej-sb-icons ej-description-icon"></span><span>Description</span>
                        </Link>
    </li>*/}
                      <li className="ej-nav ej-nav-item ej-sb-icons">
                        <div className="new-tab ej-nav-sub-item">
                          <div className="ej-nav-new ej-nav-sub-item" onClick={this.newWindow} title="Open in New Window" tabIndex="0"></div>
                        </div>
                        <div className="ej-nav-prev ej-nav-sub-item" title="Previous Sample" onClick={this.navigateNextOrPrev.bind(this, this.props.report.sampleName, "previous")} tabIndex="0" >
                        </div>
                        <div className="ej-nav-next ej-nav-sub-item" title="Next Sample" tabIndex="0" onClick={this.navigateNextOrPrev.bind(this, this.props.report.sampleName, "next")}></div>
                      </li>
                    </ul>
                    <div className="tab-content ej-tab-content" id="parentTabContent">
                      <div className={`tab-pane ej-tab-pane ${this.state.isDemoActive ? "active" : ""}`} id="demo" role="tabpanel" >
                        <ej-sample>
                          {this.ViewComponent(componentName)}
                        </ej-sample>
                      </div>
                      <div className={`tab-pane ${this.state.isSourceActive ? "active" : ""}`} id="source" role="tabpanel">
                        <div id="childTabContainer">
                          <div className="tab-content ej-tab-content" id="childTabContent">
                            <div className={`tab-pane ej-tab-pane js-content show ${this.state.isSourceActive ? "active" : ""}`} id="js" role="tabpanel"></div>
                            {/* <div className="tab-pane ej-tab-pane html-content" id="html" role="tabpanel"></div> */}
                          </div>
                          <ul className="nav ej-nav-header" id="childtTab" role="tablist">
                            <li className="ej-nav-item">
                              <a className="active js-header " data-bs-toggle="tab" role="tab" aria-selected="true">{this.props.report.routerPath + ".js"}</a>
                            </li>
                            {/* <li className="ej-nav-item">
                          <a className="html-header" href="#html" data-bs-toggle="tab" role="tab" aria-selected="false"></a>
                        </li> */}
                          </ul>
                        </div>
                      </div>
                      {/*<div className={`tab-pane ej-tab-pane ${this.state.isDescActive ? "active" : ""}`} id="ej-description" role="tabpanel">
                        {this.ViewComponent(componentName, "desc")}
                      </div>*/}
                    </div>
                  </div>
                </div>
              </ej-maincontent>
            </div>
            {/* Description section */}
            <div>
              <div className={`tab-pane ej-tab-pane ${this.state.isDescActive ? "active" : ""}`} id="ej-description" role="tabpanel">
                {this.ViewComponent(componentName, "desc")}
              </div>
            </div>
            {/* Banner section */}
            <div id="footer-banner">
              <div id="banner-head" className="header">{bannerData.text}</div>
              <div className="content-area" style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="cnt-pt">
                  <span className="tick-mark"></span>
                  <div className="cnt-text cnt-text-1">{bannerData.features[0]}</div>
                </div>
                <div className="cnt-pt">
                  <span className="tick-mark"></span>
                  <div className="cnt-text cnt-text-2">{bannerData.features[1]}</div>
                </div>
                <div className="cnt-pt">
                  <span className="tick-mark"></span>
                  <div className="cnt-text cnt-text-3">{bannerData.features[2]}</div>
                </div>
              </div>
              <a className="free-trial-url" target="_blank" rel="noreferrer" href={bannerData.freeTrialUrl}>
                <div className="free-trial">TRY IT FOR FREE</div>
              </a>
            </div>
            {/* Footer section */}
            <div className="ej-lp-footer">
              <div className="ej-lp-footer-links">
              <a href="https://help.boldreports.com/embedded-reporting/react-reporting/" target="_blank" rel="noreferrer">
                  Documentation
              </a>
              <a href="https://www.boldreports.com/blog" target="_blank" rel="noreferrer">
                  Blog
              </a>
              <a href="https://support.boldreports.com/support/tickets/create" target="_blank" rel="noreferrer">
                  Support
              </a>
              <a href="https://www.boldreports.com/feedback" target="_blank" rel="noreferrer">
                  Feedback
              </a>
              <a href="https://support.boldreports.com/" target="_blank" rel="noreferrer">
                Knowledge Base
              </a>
              <a href="https://www.boldreports.com/learn" target="_blank" rel="noreferrer">
                Learning Center
              </a>
              </div>
              <div className="ej-lp-footer-copyright">Copyright © 2001 - {data.copyrightYear} Syncfusion Inc.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class MainContentPreview extends Component {
  ViewComponent = (componentName) => {
    var SampleComponent = Globals.SampleComponents[componentName];
    return <SampleComponent />
  }
  componentDidUpdate() {
    window.addEventListener('resize', () => {
      this.setReportsHeight();
    });
  }
  setReportsHeight() {
    if (this.isExternalParameter()) {
      var style = document.getElementById('reports-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'reports-style';
        document.body.appendChild(style);
      }
      style.textContent = `ej-sample{
              display:block;
              overflow: hidden;
              height: ${window.innerHeight -
        (document.getElementById('previewContainer').getBoundingClientRect().top - document.body.getBoundingClientRect().top)}px
            }`;
      document.getElementById('report-viewer').style.height = `${window.innerHeight -
        (document.getElementById('previewContainer').getBoundingClientRect().top - document.body.getBoundingClientRect().top)}px`;
      document.getElementById('report-viewer').style.width = `100%`;
    }
  }
  isExternalParameter() {
    const externalParameterSamples = [
      '/external-parameter-report',
      '/multi-language-report'
    ];
    return externalParameterSamples.some(path => location.href.includes(path)) && location.href.includes('/preview');
  }
  componentDidMount() {
    this.setReportsHeight();
  }
  render() {
    const componentName = this.props.report.sampleName.replace(/\s/g, '');
    const title = this.props.report.sampleName + ' | Preview | React Report Viewer';
    const titleWithBoldReports = (title.length < 45) ? title + ' | Bold Reports' : title;
    document.title = titleWithBoldReports;
    document.querySelector('meta[name="description"]').setAttribute('content',  'The React Bold Report Viewer allows the end-users to visualize the ' + this.props.report.sampleName + ' report in browsers.');
    document.querySelector('meta[property="og:title"]').setAttribute('content', titleWithBoldReports);
    return (
      <div>
        <Header isPreview="true"/>
        <div className="ej-main-parent-content">
          <div id="previewContainer">
            {this.ViewComponent(componentName)}
          </div>
        </div>
      </div>
    )
  }
}

export { MainContentSample, MainContentPreview };
