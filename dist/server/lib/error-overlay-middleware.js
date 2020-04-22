"use strict";exports.__esModule=true;exports.default=errorOverlayMiddleware;var _url=_interopRequireDefault(require("url"));var _launchEditor=_interopRequireDefault(require("launch-editor"));var _fs=_interopRequireDefault(require("fs"));var _path=_interopRequireDefault(require("path"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function errorOverlayMiddleware(options){return(req,res,next)=>{if(req.url.startsWith('/_next/development/open-stack-frame-in-editor')){const query=_url.default.parse(req.url,true).query;const lineNumber=parseInt(query.lineNumber,10)||1;const colNumber=parseInt(query.colNumber,10)||1;let resolvedFileName=query.fileName;if(!_fs.default.existsSync(resolvedFileName)){resolvedFileName=_path.default.join(options.dir,resolvedFileName);}(0,_launchEditor.default)(`${resolvedFileName}:${lineNumber}:${colNumber}`);res.end();}else{next();}};}