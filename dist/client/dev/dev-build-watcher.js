"use strict";exports.__esModule=true;exports.default=initializeBuildWatcher;var _eventsource=require("./error-overlay/eventsource");function initializeBuildWatcher(){var shadowHost=document.createElement('div');shadowHost.id='__next-build-watcher';// Make sure container is fixed and on a high zIndex so it shows
shadowHost.style.position='fixed';shadowHost.style.bottom='10px';shadowHost.style.right='20px';shadowHost.style.width=0;shadowHost.style.height=0;shadowHost.style.zIndex=99999;document.body.appendChild(shadowHost);var shadowRoot;var prefix='';if(shadowHost.attachShadow){shadowRoot=shadowHost.attachShadow({mode:'open'});}else{// If attachShadow is undefined then the browser does not support
// the Shadow DOM, we need to prefix all the names so there
// will be no conflicts
shadowRoot=shadowHost;prefix='__next-build-watcher-';}// Container
var container=createContainer(prefix);shadowRoot.appendChild(container);// CSS
var css=createCss(prefix);shadowRoot.appendChild(css);// State
var isVisible=false;var isBuilding=false;var timeoutId=null;// Handle events
var evtSource=(0,_eventsource.getEventSourceWrapper)({path:'/_next/webpack-hmr'});evtSource.addMessageListener(event=>{// This is the heartbeat event
if(event.data==='\uD83D\uDC93'){return;}try{handleMessage(event);}catch(_unused){}});function handleMessage(event){var obj=JSON.parse(event.data);// eslint-disable-next-line default-case
switch(obj.action){case'building':timeoutId&&clearTimeout(timeoutId);isVisible=true;isBuilding=true;updateContainer();break;case'built':isBuilding=false;// Wait for the fade out transtion to complete
timeoutId=setTimeout(()=>{isVisible=false;updateContainer();},100);updateContainer();break;}}function updateContainer(){if(isBuilding){container.classList.add(prefix+"building");}else{container.classList.remove(prefix+"building");}if(isVisible){container.classList.add(prefix+"visible");}else{container.classList.remove(prefix+"visible");}}}function createContainer(prefix){var container=document.createElement('div');container.id=prefix+"container";container.innerHTML="\n    <div id=\""+prefix+"icon-wrapper\">\n      <svg viewBox=\"0 0 226 200\">\n        <defs>\n          <linearGradient\n            x1=\"114.720775%\"\n            y1=\"181.283245%\"\n            x2=\"39.5399306%\"\n            y2=\"100%\"\n            id=\""+prefix+"linear-gradient\"\n          >\n            <stop stop-color=\"#FFFFFF\" offset=\"0%\" />\n            <stop stop-color=\"#000000\" offset=\"100%\" />\n          </linearGradient>\n        </defs>\n        <g id=\""+prefix+"icon-group\" fill=\"none\" stroke=\"url(#"+prefix+"linear-gradient)\" stroke-width=\"18\">\n          <path d=\"M113,5.08219117 L4.28393801,197.5 L221.716062,197.5 L113,5.08219117 Z\" />\n        </g>\n      </svg>\n    </div>\n  ";return container;}function createCss(prefix){var css=document.createElement('style');css.textContent="\n    #"+prefix+"container {\n      position: absolute;\n      bottom: 10px;\n      right: 30px;\n\n      background: #fff;\n      color: #000;\n      font: initial;\n      cursor: initial;\n      letter-spacing: initial;\n      text-shadow: initial;\n      text-transform: initial;\n      visibility: initial;\n\n      padding: 8px 10px;\n      align-items: center;\n      box-shadow: 0 11px 40px 0 rgba(0, 0, 0, 0.25), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n\n      display: none;\n      opacity: 0;\n      transition: opacity 0.1s ease, bottom 0.1s ease;\n      animation: "+prefix+"fade-in 0.1s ease-in-out;\n    }\n\n    #"+prefix+"container."+prefix+"visible {\n      display: flex;\n    }\n\n    #"+prefix+"container."+prefix+"building {\n      bottom: 20px;\n      opacity: 1;\n    }\n\n    #"+prefix+"icon-wrapper {\n      width: 16px;\n      height: 16px;\n    }\n\n    #"+prefix+"icon-wrapper > svg {\n      width: 100%;\n      height: 100%;\n    }\n\n    #"+prefix+"icon-group {\n      animation: "+prefix+"strokedash 1s ease-in-out both infinite;\n    }\n\n    @keyframes "+prefix+"fade-in {\n      from {\n        bottom: 10px;\n        opacity: 0;\n      }\n      to {\n        bottom: 20px;\n        opacity: 1;\n      }\n    }\n\n    @keyframes "+prefix+"strokedash {\n      0% {\n        stroke-dasharray: 0 226;\n      }\n      80%,\n      100% {\n        stroke-dasharray: 659 226;\n      }\n    }\n  ";return css;}