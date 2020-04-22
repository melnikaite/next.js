"use strict";var _interopRequireWildcard=require("@babel/runtime-corejs2/helpers/interopRequireWildcard");var _interopRequireDefault=require("@babel/runtime-corejs2/helpers/interopRequireDefault");exports.__esModule=true;exports.default=void 0;var _map=_interopRequireDefault(require("@babel/runtime-corejs2/core-js/map"));var _url=require("url");var _react=_interopRequireWildcard(require("react"));var _router=_interopRequireDefault(require("./router"));var _utils=require("../next-server/lib/utils");function isLocal(href){var url=(0,_url.parse)(href,false,true);var origin=(0,_url.parse)((0,_utils.getLocationOrigin)(),false,true);return!url.host||url.protocol===origin.protocol&&url.host===origin.host;}function memoizedFormatUrl(formatFunc){var lastHref=null;var lastAs=null;var lastResult=null;return(href,as)=>{if(lastResult&&href===lastHref&&as===lastAs){return lastResult;}var result=formatFunc(href,as);lastHref=href;lastAs=as;lastResult=result;return result;};}function formatUrl(url){return url&&typeof url==='object'?(0,_utils.formatWithValidation)(url):url;}var observer;var listeners=new _map.default();var IntersectionObserver=typeof window!=='undefined'?window.IntersectionObserver:null;var prefetched={};function getObserver(){// Return shared instance of IntersectionObserver if already created
if(observer){return observer;}// Only create shared IntersectionObserver if supported in browser
if(!IntersectionObserver){return undefined;}return observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!listeners.has(entry.target)){return;}var cb=listeners.get(entry.target);if(entry.isIntersecting||entry.intersectionRatio>0){observer.unobserve(entry.target);listeners.delete(entry.target);cb();}});},{rootMargin:'200px'});}var listenToIntersections=(el,cb)=>{var observer=getObserver();if(!observer){return()=>{};}observer.observe(el);listeners.set(el,cb);return()=>{try{observer.unobserve(el);}catch(err){console.error(err);}listeners.delete(el);};};class Link extends _react.Component{constructor(props){super(props);this.p=void 0;this.cleanUpListeners=()=>{};this.formatUrls=memoizedFormatUrl((href,asHref)=>{return{href:formatUrl(href),as:asHref?formatUrl(asHref):asHref};});this.linkClicked=e=>{// @ts-ignore target exists on currentTarget
var{nodeName,target}=e.currentTarget;if(nodeName==='A'&&(target&&target!=='_self'||e.metaKey||e.ctrlKey||e.shiftKey||e.nativeEvent&&e.nativeEvent.which===2)){// ignore click for new tab / new window behavior
return;}var{href,as}=this.formatUrls(this.props.href,this.props.as);if(!isLocal(href)){// ignore click if it's outside our scope (e.g. https://google.com)
return;}var{pathname}=window.location;href=(0,_url.resolve)(pathname,href);as=as?(0,_url.resolve)(pathname,as):href;e.preventDefault();//  avoid scroll for urls with anchor refs
var{scroll}=this.props;if(scroll==null){scroll=as.indexOf('#')<0;}// replace state instead of push if prop is present
_router.default[this.props.replace?'replace':'push'](href,as,{shallow:this.props.shallow}).then(success=>{if(!success)return;if(scroll){window.scrollTo(0,0);document.body.focus();}});};if(process.env.NODE_ENV!=='production'){if(props.prefetch){console.warn('Next.js auto-prefetches automatically based on viewport. The prefetch attribute is no longer needed. More: https://err.sh/zeit/next.js/prefetch-true-deprecated');}}this.p=props.prefetch!==false;}componentWillUnmount(){this.cleanUpListeners();}getHref(){var{pathname}=window.location;var{href:parsedHref}=this.formatUrls(this.props.href,this.props.as);return(0,_url.resolve)(pathname,parsedHref);}handleRef(ref){var isPrefetched=prefetched[this.getHref()];if(this.p&&IntersectionObserver&&ref&&ref.tagName){this.cleanUpListeners();if(!isPrefetched){this.cleanUpListeners=listenToIntersections(ref,()=>{this.prefetch();});}}}// The function is memoized so that no extra lifecycles are needed
// as per https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
prefetch(){if(!this.p||typeof window==='undefined')return;// Prefetch the JSON page if asked (only in the client)
var href=this.getHref();_router.default.prefetch(href);prefetched[href]=true;}render(){var{children}=this.props;var{href,as}=this.formatUrls(this.props.href,this.props.as);// Deprecated. Warning shown by propType check. If the children provided is a string (<Link>example</Link>) we wrap it in an <a> tag
if(typeof children==='string'){children=_react.default.createElement("a",null,children);}// This will return the first child, if multiple are provided it will throw an error
var child=_react.Children.only(children);var props={ref:el=>{this.handleRef(el);if(child&&typeof child==='object'&&child.ref){if(typeof child.ref==='function')child.ref(el);else if(typeof child.ref==='object'){child.ref.current=el;}}},onMouseEnter:e=>{if(child.props&&typeof child.props.onMouseEnter==='function'){child.props.onMouseEnter(e);}this.prefetch();},onClick:e=>{if(child.props&&typeof child.props.onClick==='function'){child.props.onClick(e);}if(!e.defaultPrevented){this.linkClicked(e);}}};// If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
// defined, we specify the current 'href', so that repetition is not needed by the user
if(this.props.passHref||child.type==='a'&&!('href'in child.props)){props.href=as||href;}// Add the ending slash to the paths. So, we can serve the
// "<page>/index.html" directly.
if(process.env.__NEXT_EXPORT_TRAILING_SLASH){var rewriteUrlForNextExport=require('../next-server/lib/router/rewrite-url-for-export').rewriteUrlForNextExport;if(props.href&&typeof __NEXT_DATA__!=='undefined'&&__NEXT_DATA__.nextExport){props.href=rewriteUrlForNextExport(props.href);}}return _react.default.cloneElement(child,props);}}if(process.env.NODE_ENV==='development'){var warn=(0,_utils.execOnce)(console.error);// This module gets removed by webpack.IgnorePlugin
var PropTypes=require('prop-types');var exact=require('prop-types-exact');// @ts-ignore the property is supported, when declaring it on the class it outputs an extra bit of code which is not needed.
Link.propTypes=exact({href:PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,as:PropTypes.oneOfType([PropTypes.string,PropTypes.object]),prefetch:PropTypes.bool,replace:PropTypes.bool,shallow:PropTypes.bool,passHref:PropTypes.bool,scroll:PropTypes.bool,children:PropTypes.oneOfType([PropTypes.element,(props,propName)=>{var value=props[propName];if(typeof value==='string'){warn("Warning: You're using a string directly inside <Link>. This usage has been deprecated. Please add an <a> tag as child of <Link>");}return null;}]).isRequired});}var _default=Link;exports.default=_default;