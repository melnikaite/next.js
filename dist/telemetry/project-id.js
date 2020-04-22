"use strict";exports.__esModule=true;exports.getRawProjectId=getRawProjectId;var _child_process=require("child_process");function _getProjectIdByGit(){try{const originBuffer=(0,_child_process.execSync)(`git config --local --get remote.origin.url`,{timeout:1000,stdio:`pipe`});return String(originBuffer).trim();}catch(_){return null;}}function getRawProjectId(){return _getProjectIdByGit()||process.env.REPOSITORY_URL||process.cwd();}