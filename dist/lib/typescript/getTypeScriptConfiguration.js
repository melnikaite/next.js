"use strict";exports.__esModule=true;exports.getTypeScriptConfiguration=getTypeScriptConfiguration;var _chalk=_interopRequireDefault(require("next/dist/compiled/chalk"));var _os=_interopRequireDefault(require("os"));var _path=_interopRequireDefault(require("path"));var _FatalTypeScriptError=require("./FatalTypeScriptError");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}async function getTypeScriptConfiguration(ts,tsConfigPath){try{var _result$errors;const formatDiagnosticsHost={getCanonicalFileName:fileName=>fileName,getCurrentDirectory:ts.sys.getCurrentDirectory,getNewLine:()=>_os.default.EOL};const{config,error}=ts.readConfigFile(tsConfigPath,ts.sys.readFile);if(error){throw new _FatalTypeScriptError.FatalTypeScriptError(ts.formatDiagnostic(error,formatDiagnosticsHost));}const result=ts.parseJsonConfigFileContent(config,ts.sys,_path.default.dirname(tsConfigPath));if(result.errors){result.errors=result.errors.filter(({code})=>// No inputs were found in config file
code!==18003);}if((_result$errors=result.errors)==null?void 0:_result$errors.length){throw new _FatalTypeScriptError.FatalTypeScriptError(ts.formatDiagnostic(result.errors[0],formatDiagnosticsHost));}return result;}catch(err){if((err==null?void 0:err.name)==='SyntaxError'){var _err$message;const reason='\n'+((_err$message=err==null?void 0:err.message)!=null?_err$message:'');throw new _FatalTypeScriptError.FatalTypeScriptError(_chalk.default.red.bold('Could not parse',_chalk.default.cyan('tsconfig.json')+'.'+' Please make sure it contains syntactically correct JSON.')+reason);}throw err;}}
//# sourceMappingURL=getTypeScriptConfiguration.js.map