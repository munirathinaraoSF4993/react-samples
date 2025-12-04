import 'bootstrap/dist/css/bootstrap.min.css';
import data from './samples.json';
import './styles/index.css'
import { Designer } from './controls/designer/designer';
import { Route, Switch, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import '@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-viewer.min.css';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
import '@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-designer.min.css';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-designer.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.en-US.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.fr-CA.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.de-DE.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.hi-IN.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.es-ES.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.nl-NL.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.ko-KR.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.he-IL.min.js';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/localization/l10n/ej.localetexts.ru-RU.min.js';
import { MainContentSample, MainContentPreview } from './common/main-content/main-content';
const samples = data.samples;

class App extends React.Component {
  renderViewer = (routerProps) => {
    var previewUrl = routerProps.match.url.toString();
    previewUrl = previewUrl.replace(/\/+$/, '').split('/').pop();
    var isPreview = previewUrl === "preview" ? true : false;
    let samplePathName = routerProps.match.params.id;
    let foundViewer = samples.find(sample => sample.routerPath === samplePathName);
    return (foundViewer ? isPreview ? <MainContentPreview report={foundViewer} /> : <MainContentSample report={foundViewer} /> : <Redirect to={"/report-viewer/product-line-sales/"} />)
  }

  addTrailingSlash = () => {
    const rawHash = window.location.hash || '#/';
    let [path, query = ''] = rawHash.slice(1).split('?');
    query = query ? `?${query}` : '';
    const redirectionMap = {
      '/report-designer': '/report-designer/',
      '/report-designer/rdlc': '/report-designer/rdlc/',
    };
    let normalizedPath = redirectionMap[path] || path;
    if (!normalizedPath.endsWith('/') && /^\/report-viewer\/[^/]+(?:\/preview)?$/.test(normalizedPath)) {
      normalizedPath += '/';
    }
    const normalizedHash = `${normalizedPath}${query}`;
    if (normalizedHash !== rawHash.slice(1)) {
      window.location.hash = normalizedHash;
    }
  }

  state = {
    redirect: false
  }
  componentDidMount() {
    this.addTrailingSlash();
    window.addEventListener('hashchange', this.addTrailingSlash, { passive: true });
    this.id = setTimeout(() => this.setState({ redirect: true }), 2000);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.addTrailingSlash);
    clearTimeout(this.id);
  }
  render() {
    return (
      <div>
        <div className="mobile-overlay e-hidden"></div>
        <div className="ej-overlay e-hidden"></div>
        <Switch>
          <Route exact path={'/report-designer/'} >
            {
              this.state.redirect ? <Designer /> : <IndexLoading />
            }
          </Route>
          <Route exact path={'/report-designer/rdlc/'} >
            {
              this.state.redirect ? <Designer reportType={'rdlc'} /> : <IndexLoading />
            }
          </Route>
          <Route exact path={['/', '/report-viewer', '/report-viewer/']} >
            {
              this.state.redirect ? <Redirect to={"/report-viewer/product-line-sales/"} render={routerProps => this.renderViewer(routerProps)} exact /> : <IndexLoading />
            }
          </Route>
          <Route path={"/report-viewer/:id/"} render={routerProps => this.renderViewer(routerProps)} exact></Route>
          <Route path={"/report-viewer/:id/preview/"} render={routerProps => this.renderViewer(routerProps)} exact></Route>
          <Route path={'*'}>
            <Redirect to={"/report-viewer/product-line-sales/"}></Redirect>
          </Route>
        </Switch>
      </div>
    )
  }
}

class IndexLoading extends Component {
  render() {
    return (
      <div className="splash">
        <div className="message">
          React Reporting
          <div className="loader">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default App