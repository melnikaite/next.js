"use strict";var _interopRequireWildcard3=require("@babel/runtime-corejs2/helpers/interopRequireWildcard");var _interopRequireDefault=require("@babel/runtime-corejs2/helpers/interopRequireDefault");exports.__esModule=true;exports.render=render;exports.renderError=renderError;exports.default=exports.emitter=exports.router=exports.version=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));var _extends2=_interopRequireDefault(require("@babel/runtime-corejs2/helpers/extends"));var _interopRequireWildcard2=_interopRequireDefault(require("@babel/runtime-corejs2/helpers/interopRequireWildcard"));var _promise=_interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));var _react=_interopRequireDefault(require("react"));var _reactDom=_interopRequireDefault(require("react-dom"));var _headManager=_interopRequireDefault(require("./head-manager"));var _router=require("next/router");var _mitt=_interopRequireDefault(require("../next-server/lib/mitt"));var _utils=require("../next-server/lib/utils");var _pageLoader=_interopRequireDefault(require("./page-loader"));var envConfig=_interopRequireWildcard3(require("../next-server/lib/runtime-config"));var _headManagerContext=require("../next-server/lib/head-manager-context");var _routerContext=require("../next-server/lib/router-context");var _querystring=require("querystring");var _isDynamic=require("../next-server/lib/router/utils/is-dynamic");/* global location */if(!window.Promise){window.Promise=_promise.default;}var data=JSON.parse(document.getElementById('__NEXT_DATA__').textContent);window.__NEXT_DATA__=data;var version="9.2.0";exports.version=version;var{props,err,page,query,buildId,assetPrefix,runtimeConfig,dynamicIds}=data;var prefix=assetPrefix||'';// With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime
__webpack_public_path__=prefix+"/_next/";//eslint-disable-line
// Initialize next/config with the environment configuration
envConfig.setConfig({serverRuntimeConfig:{},publicRuntimeConfig:runtimeConfig||{}});var asPath=(0,_utils.getURL)();var pageLoader=new _pageLoader.default(buildId,prefix);var register=(_ref)=>{var[r,f]=_ref;return pageLoader.registerPage(r,f);};if(window.__NEXT_P){window.__NEXT_P.map(register);}window.__NEXT_P=[];window.__NEXT_P.push=register;var headManager=new _headManager.default();var appElement=document.getElementById('__next');var lastAppProps;var webpackHMR;var router;exports.router=router;var ErrorComponent;var Component;var App,onPerfEntry;class Container extends _react.default.Component{componentDidCatch(err,info){this.props.fn(err,info);}componentDidMount(){this.scrollToHash();if(process.env.__NEXT_PLUGINS){// eslint-disable-next-line
_promise.default.resolve().then(()=>(0,_interopRequireWildcard2.default)(require('next-plugin-loader?middleware=unstable-post-hydration!'))).then(mod=>{return mod.default();}).catch(err=>{console.error('Error calling post-hydration for plugins',err);});}// If page was exported and has a querystring
// If it's a dynamic route or has a querystring
if(data.nextExport&&((0,_isDynamic.isDynamicRoute)(router.pathname)||location.search)||Component&&Component.__N_SSG&&location.search){// update query on mount for exported pages
router.replace(router.pathname+'?'+(0,_querystring.stringify)((0,_extends2.default)({},router.query,{},(0,_querystring.parse)(location.search.substr(1)))),asPath,{// WARNING: `_h` is an internal option for handing Next.js
// client-side hydration. Your app should _never_ use this property.
// It may change at any time without notice.
_h:1,shallow:true});}}componentDidUpdate(){this.scrollToHash();}scrollToHash(){var{hash}=location;hash=hash&&hash.substring(1);if(!hash)return;var el=document.getElementById(hash);if(!el)return;// If we call scrollIntoView() in here without a setTimeout
// it won't scroll properly.
setTimeout(()=>el.scrollIntoView(),0);}render(){return this.props.children;}}var emitter=(0,_mitt.default)();exports.emitter=emitter;var _default=/*#__PURE__*/function(){var _ref2=(0,_asyncToGenerator2.default)(function*(_temp){var{webpackHMR:passedWebpackHMR}=_temp===void 0?{}:_temp;// This makes sure this specific lines are removed in production
if(process.env.NODE_ENV==='development'){webpackHMR=passedWebpackHMR;}var{page:app,mod}=yield pageLoader.loadPageScript('/_app');App=app;if(mod&&mod.unstable_onPerformanceData){onPerfEntry=function onPerfEntry(_ref3){var{name,startTime,value,duration}=_ref3;mod.unstable_onPerformanceData({name,startTime,value,duration});};}var initialErr=err;try{Component=yield pageLoader.loadPage(page);if(process.env.NODE_ENV!=='production'){var{isValidElementType}=require('react-is');if(!isValidElementType(Component)){throw new Error("The default export is not a React Component in page: \""+page+"\"");}}}catch(error){// This catches errors like throwing in the top level of a module
initialErr=error;}if(window.__NEXT_PRELOADREADY){yield window.__NEXT_PRELOADREADY(dynamicIds);}exports.router=router=(0,_router.createRouter)(page,query,asPath,{initialProps:props,pageLoader,App,Component,wrapApp,err:initialErr,subscription:(_ref4,App)=>{var{Component,props,err}=_ref4;render({App,Component,props,err});}});// call init-client middleware
if(process.env.__NEXT_PLUGINS){// eslint-disable-next-line
_promise.default.resolve().then(()=>(0,_interopRequireWildcard2.default)(require('next-plugin-loader?middleware=on-init-client!'))).then(mod=>{return mod.default({router});}).catch(err=>{console.error('Error calling client-init for plugins',err);});}var renderCtx={App,Component,props,err:initialErr};render(renderCtx);return emitter;});return function(_x){return _ref2.apply(this,arguments);};}();exports.default=_default;function render(_x2){return _render.apply(this,arguments);}// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
function _render(){_render=(0,_asyncToGenerator2.default)(function*(props){if(props.err){yield renderError(props);return;}try{yield doRender(props);}catch(err){yield renderError((0,_extends2.default)({},props,{err}));}});return _render.apply(this,arguments);}function renderError(_x3){return _renderError.apply(this,arguments);}// If hydrate does not exist, eg in preact.
function _renderError(){_renderError=(0,_asyncToGenerator2.default)(function*(props){var{App,err}=props;// In development runtime errors are caught by react-error-overlay
// In production we catch runtime errors using componentDidCatch which will trigger renderError
if(process.env.NODE_ENV!=='production'){return webpackHMR.reportRuntimeError(webpackHMR.prepareError(err));}if(process.env.__NEXT_PLUGINS){// eslint-disable-next-line
_promise.default.resolve().then(()=>(0,_interopRequireWildcard2.default)(require('next-plugin-loader?middleware=on-error-client!'))).then(mod=>{return mod.default({err});}).catch(err=>{console.error('error calling on-error-client for plugins',err);});}// Make sure we log the error to the console, otherwise users can't track down issues.
console.error(err);ErrorComponent=yield pageLoader.loadPage('/_error');// In production we do a normal render with the `ErrorComponent` as component.
// If we've gotten here upon initial render, we can use the props from the server.
// Otherwise, we need to call `getInitialProps` on `App` before mounting.
var AppTree=wrapApp(App);var appCtx={Component:ErrorComponent,AppTree,router,ctx:{err,pathname:page,query,asPath,AppTree}};var initProps=props.props?props.props:yield(0,_utils.loadGetInitialProps)(App,appCtx);yield doRender((0,_extends2.default)({},props,{err,Component:ErrorComponent,props:initProps}));});return _renderError.apply(this,arguments);}var isInitialRender=typeof _reactDom.default.hydrate==='function';var reactRoot=null;function renderReactElement(reactEl,domEl){if(process.env.__NEXT_REACT_MODE!=='legacy'){if(!reactRoot){var opts={hydrate:true};reactRoot=process.env.__NEXT_REACT_MODE==='concurrent'?_reactDom.default.createRoot(domEl,opts):_reactDom.default.createBlockingRoot(domEl,opts);}reactRoot.render(reactEl);}else{// mark start of hydrate/render
if(_utils.ST){performance.mark('beforeRender');}// The check for `.hydrate` is there to support React alternatives like preact
if(isInitialRender){_reactDom.default.hydrate(reactEl,domEl,markHydrateComplete);isInitialRender=false;}else{_reactDom.default.render(reactEl,domEl,markRenderComplete);}}if(onPerfEntry&&_utils.ST){try{var observer=new PerformanceObserver(list=>{list.getEntries().forEach(onPerfEntry);});// Start observing paint entry types.
observer.observe({type:'paint',buffered:true});}catch(e){window.addEventListener('load',()=>{performance.getEntriesByType('paint').forEach(onPerfEntry);});}}}function markHydrateComplete(){if(!_utils.ST)return;performance.mark('afterHydrate');// mark end of hydration
performance.measure('Next.js-before-hydration','navigationStart','beforeRender');performance.measure('Next.js-hydration','beforeRender','afterHydrate');if(onPerfEntry){performance.getEntriesByName('Next.js-hydration').forEach(onPerfEntry);performance.getEntriesByName('beforeRender').forEach(onPerfEntry);}clearMarks();}function markRenderComplete(){if(!_utils.ST)return;performance.mark('afterRender');// mark end of render
var navStartEntries=performance.getEntriesByName('routeChange','mark');if(!navStartEntries.length){return;}performance.measure('Next.js-route-change-to-render',navStartEntries[0].name,'beforeRender');performance.measure('Next.js-render','beforeRender','afterRender');if(onPerfEntry){performance.getEntriesByName('Next.js-render').forEach(onPerfEntry);performance.getEntriesByName('Next.js-route-change-to-render').forEach(onPerfEntry);}clearMarks();}function clearMarks(){;['beforeRender','afterHydrate','afterRender','routeChange'].forEach(mark=>performance.clearMarks(mark));['Next.js-before-hydration','Next.js-hydration','Next.js-route-change-to-render','Next.js-render'].forEach(measure=>performance.clearMeasures(measure));}function AppContainer(_ref5){var{children}=_ref5;return _react.default.createElement(Container,{fn:error=>renderError({App,err:error}).catch(err=>console.error('Error rendering page: ',err))},_react.default.createElement(_routerContext.RouterContext.Provider,{value:(0,_router.makePublicRouterInstance)(router)},_react.default.createElement(_headManagerContext.HeadManagerContext.Provider,{value:headManager.updateHead},children)));}var wrapApp=App=>props=>{var appProps=(0,_extends2.default)({},props,{Component,err,router});return _react.default.createElement(AppContainer,null,_react.default.createElement(App,appProps));};function doRender(_x4){return _doRender.apply(this,arguments);}function _doRender(){_doRender=(0,_asyncToGenerator2.default)(function*(_ref6){var{App,Component,props,err}=_ref6;// Usual getInitialProps fetching is handled in next/router
// this is for when ErrorComponent gets replaced by Component by HMR
if(!props&&Component&&Component!==ErrorComponent&&lastAppProps.Component===ErrorComponent){var{pathname,query:_query,asPath:_asPath}=router;var AppTree=wrapApp(App);var appCtx={router,AppTree,Component:ErrorComponent,ctx:{err,pathname,query:_query,asPath:_asPath,AppTree}};props=yield(0,_utils.loadGetInitialProps)(App,appCtx);}Component=Component||lastAppProps.Component;props=props||lastAppProps.props;var appProps=(0,_extends2.default)({},props,{Component,err,router});// lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
lastAppProps=appProps;emitter.emit('before-reactdom-render',{Component,ErrorComponent,appProps});var elem=_react.default.createElement(AppContainer,null,_react.default.createElement(App,appProps));// We catch runtime errors using componentDidCatch which will trigger renderError
renderReactElement(process.env.__NEXT_STRICT_MODE?_react.default.createElement(_react.default.StrictMode,null,elem):elem,appElement);emitter.emit('after-reactdom-render',{Component,ErrorComponent,appProps});});return _doRender.apply(this,arguments);}