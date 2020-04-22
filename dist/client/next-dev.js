"use strict";var _interopRequireDefault=require("@babel/runtime-corejs2/helpers/interopRequireDefault");var _interopRequireWildcard=require("@babel/runtime-corejs2/helpers/interopRequireWildcard");var next=_interopRequireWildcard(require("./"));var _eventSourcePolyfill=_interopRequireDefault(require("./dev/event-source-polyfill"));var _onDemandEntriesClient=_interopRequireDefault(require("./dev/on-demand-entries-client"));var _webpackHotMiddlewareClient=_interopRequireDefault(require("./dev/webpack-hot-middleware-client"));var _devBuildWatcher=_interopRequireDefault(require("./dev/dev-build-watcher"));var _prerenderIndicator=_interopRequireDefault(require("./dev/prerender-indicator"));var _fouc=require("./dev/fouc");/* globals import('./dev/noop'); */import('./dev/noop');;// Support EventSource on Internet Explorer 11
if(!window.EventSource){window.EventSource=_eventSourcePolyfill.default;}var{__NEXT_DATA__:{assetPrefix}}=window;var prefix=assetPrefix||'';var webpackHMR=(0,_webpackHotMiddlewareClient.default)({assetPrefix:prefix});window.next=next;(0,next.default)({webpackHMR}).then(emitter=>{(0,_onDemandEntriesClient.default)({assetPrefix:prefix});if(process.env.__NEXT_BUILD_INDICATOR)(0,_devBuildWatcher.default)();if(process.env.__NEXT_PRERENDER_INDICATOR&&// disable by default in electron
!(typeof process!=='undefined'&&'electron'in process.versions)){(0,_prerenderIndicator.default)();}(0,_fouc.displayContent)();var lastScroll;emitter.on('before-reactdom-render',(_ref)=>{var{Component,ErrorComponent}=_ref;// Remember scroll when ErrorComponent is being rendered to later restore it
if(!lastScroll&&Component===ErrorComponent){var{pageXOffset,pageYOffset}=window;lastScroll={x:pageXOffset,y:pageYOffset};}});emitter.on('after-reactdom-render',(_ref2)=>{var{Component,ErrorComponent}=_ref2;if(lastScroll&&Component!==ErrorComponent){// Restore scroll after ErrorComponent was replaced with a page component by HMR
var{x,y}=lastScroll;window.scroll(x,y);lastScroll=null;}});}).catch(err=>{console.error('Error was not caught',err);});