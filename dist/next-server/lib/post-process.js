"use strict";exports.__esModule=true;exports.default=void 0;var _nodeHtmlParser=require("node-html-parser");var _constants=require("./constants");const MIDDLEWARE_TIME_BUDGET=10;const middlewareRegistry=[];function registerPostProcessor(name,middleware,condition){middlewareRegistry.push({name,middleware,condition:condition||null});}async function processHTML(html,data,options){// Don't parse unless there's at least one processor middleware
if(!middlewareRegistry[0]){return html;}const postProcessData={preloads:{images:[]}};const root=(0,_nodeHtmlParser.parse)(html);let document=html;// Calls the middleware, with some instrumentation and logging
async function callMiddleWare(middleware,name){let timer=Date.now();middleware.inspect(root,postProcessData,data);const inspectTime=Date.now()-timer;document=await middleware.mutate(document,postProcessData,data);timer=Date.now()-timer;if(timer>MIDDLEWARE_TIME_BUDGET){console.warn(`The postprocess middleware "${name}" took ${timer}ms(${inspectTime}, ${timer-inspectTime}) to complete. This is longer than the ${MIDDLEWARE_TIME_BUDGET} limit.`);}return;}for(let i=0;i<middlewareRegistry.length;i++){let middleware=middlewareRegistry[i];if(!middleware.condition||middleware.condition(options)){await callMiddleWare(middlewareRegistry[i].middleware,middlewareRegistry[i].name);}}return document;}class FontOptimizerMiddleware{constructor(){this.fontDefinitions=[];this.mutate=async(markup,_data,options)=>{let result=markup;if(!options.getFontDefinition){return markup;}for(const key in this.fontDefinitions){const url=this.fontDefinitions[key];if(result.indexOf(`<style data-href="${url}">`)>-1){// The font is already optimized and probably the response is cached
continue;}const fontContent=options.getFontDefinition(url);result=result.replace('</head>',`<style data-href="${url}">${fontContent.replace(/(\n|\s)/g,'')}</style></head>`);}return result;};}inspect(originalDom,_data,options){if(!options.getFontDefinition){return;}// collecting all the requested font definitions
originalDom.querySelectorAll('link').filter(tag=>tag.getAttribute('rel')==='stylesheet'&&tag.hasAttribute('data-href')&&_constants.OPTIMIZED_FONT_PROVIDERS.some(url=>tag.getAttribute('data-href').startsWith(url))).forEach(element=>{const url=element.getAttribute('data-href');this.fontDefinitions.push(url);});}}// Initialization
registerPostProcessor('Inline-Fonts',new FontOptimizerMiddleware(),// Using process.env because passing Experimental flag through loader is not possible.
// @ts-ignore
options=>options.optimizeFonts||process.env.__NEXT_OPTIMIZE_FONTS);var _default=processHTML;exports.default=_default;
//# sourceMappingURL=post-process.js.map