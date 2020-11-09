"use strict";exports.__esModule=true;exports.sendPayload=sendPayload;var _utils=require("../lib/utils");var _etag=_interopRequireDefault(require("next/dist/compiled/etag"));var _fresh=_interopRequireDefault(require("next/dist/compiled/fresh"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function sendPayload(req,res,payload,type,{generateEtags,poweredByHeader},options){if((0,_utils.isResSent)(res)){return;}if(poweredByHeader&&type==='html'){res.setHeader('X-Powered-By','Next.js');}const etag=generateEtags?(0,_etag.default)(payload):undefined;if((0,_fresh.default)(req.headers,{etag})){res.statusCode=304;res.end();return;}if(etag){res.setHeader('ETag',etag);}if(!res.getHeader('Content-Type')){res.setHeader('Content-Type',type==='json'?'application/json':'text/html; charset=utf-8');}res.setHeader('Content-Length',Buffer.byteLength(payload));if(options!=null){if(options.private||options.stateful){if(options.private||!res.hasHeader('Cache-Control')){res.setHeader('Cache-Control',`private, no-cache, no-store, max-age=0, must-revalidate`);}}else if(typeof options.revalidate==='number'){if(options.revalidate<1){throw new Error(`invariant: invalid Cache-Control duration provided: ${options.revalidate} < 1`);}res.setHeader('Cache-Control',`s-maxage=${options.revalidate}, stale-while-revalidate`);}else if(options.revalidate===false){res.setHeader('Cache-Control',`s-maxage=31536000, stale-while-revalidate`);}}res.end(req.method==='HEAD'?null:payload);}
//# sourceMappingURL=send-payload.js.map