"use strict";exports.__esModule=true;exports.attachReactRefresh=attachReactRefresh;exports.default=getBaseWebpackConfig;var _codeFrame=require("next/dist/compiled/babel/code-frame");var _ReactRefreshWebpackPlugin=_interopRequireDefault(require("@next/react-refresh-utils/ReactRefreshWebpackPlugin"));var _crypto=_interopRequireDefault(require("crypto"));var _fs=require("fs");var _chalk=_interopRequireDefault(require("chalk"));var _semver=_interopRequireDefault(require("next/dist/compiled/semver"));var _terserWebpackPlugin=_interopRequireDefault(require("next/dist/compiled/terser-webpack-plugin"));var _path=_interopRequireDefault(require("path"));var _webpack=_interopRequireDefault(require("webpack"));var _constants=require("../lib/constants");var _fileExists=require("../lib/file-exists");var _getPackageVersion=require("../lib/get-package-version");var _resolveRequest=require("../lib/resolve-request");var _getTypeScriptConfiguration=require("../lib/typescript/getTypeScriptConfiguration");var _constants2=require("../next-server/lib/constants");var _utils=require("../next-server/lib/utils");var _findPageFile=require("../server/lib/find-page-file");var Log=_interopRequireWildcard(require("./output/log"));var _collectPlugins=require("./plugins/collect-plugins");var _config=require("./webpack/config");var _overrideCssConfiguration=require("./webpack/config/blocks/css/overrideCssConfiguration");var _nextPluginLoader=require("./webpack/loaders/next-plugin-loader");var _buildManifestPlugin=_interopRequireDefault(require("./webpack/plugins/build-manifest-plugin"));var _chunkNamesPlugin=_interopRequireDefault(require("./webpack/plugins/chunk-names-plugin"));var _cssMinimizerPlugin=require("./webpack/plugins/css-minimizer-plugin");var _jsconfigPathsPlugin=require("./webpack/plugins/jsconfig-paths-plugin");var _nextDropClientPagePlugin=require("./webpack/plugins/next-drop-client-page-plugin");var _nextjsSsrImport=_interopRequireDefault(require("./webpack/plugins/nextjs-ssr-import"));var _nextjsSsrModuleCache=_interopRequireDefault(require("./webpack/plugins/nextjs-ssr-module-cache"));var _pagesManifestPlugin=_interopRequireDefault(require("./webpack/plugins/pages-manifest-plugin"));var _profilingPlugin=require("./webpack/plugins/profiling-plugin");var _reactLoadablePlugin=require("./webpack/plugins/react-loadable-plugin");var _serverlessPlugin=require("./webpack/plugins/serverless-plugin");var _webpackConformancePlugin=_interopRequireWildcard(require("./webpack/plugins/webpack-conformance-plugin"));var _wellknownErrorsPlugin=require("./webpack/plugins/wellknown-errors-plugin");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}const isWebpack5=parseInt(_webpack.default.version)===5;const devtoolRevertWarning=(0,_utils.execOnce)(devtool=>{console.warn(_chalk.default.yellow.bold('Warning: ')+_chalk.default.bold(`Reverting webpack devtool to '${devtool}'.\n`)+'Changing the webpack devtool in development mode will cause severe performance regressions.\n'+'Read more: https://err.sh/next.js/improper-devtool');});function parseJsonFile(filePath){const JSON5=require('next/dist/compiled/json5');const contents=(0,_fs.readFileSync)(filePath,'utf8');// Special case an empty file
if(contents.trim()===''){return{};}try{return JSON5.parse(contents);}catch(err){const codeFrame=(0,_codeFrame.codeFrameColumns)(String(contents),{start:{line:err.lineNumber,column:err.columnNumber}},{message:err.message,highlightCode:true});throw new Error(`Failed to parse "${filePath}":\n${codeFrame}`);}}function getOptimizedAliases(isServer){if(isServer){return{};}const stubWindowFetch=_path.default.join(__dirname,'polyfills','fetch','index.js');const stubObjectAssign=_path.default.join(__dirname,'polyfills','object-assign.js');const shimAssign=_path.default.join(__dirname,'polyfills','object.assign');return Object.assign({},{unfetch$:stubWindowFetch,'isomorphic-unfetch$':stubWindowFetch,'whatwg-fetch$':_path.default.join(__dirname,'polyfills','fetch','whatwg-fetch.js')},{'object-assign$':stubObjectAssign,// Stub Package: object.assign
'object.assign/auto':_path.default.join(shimAssign,'auto.js'),'object.assign/implementation':_path.default.join(shimAssign,'implementation.js'),'object.assign$':_path.default.join(shimAssign,'index.js'),'object.assign/polyfill':_path.default.join(shimAssign,'polyfill.js'),'object.assign/shim':_path.default.join(shimAssign,'shim.js'),// Replace: full URL polyfill with platform-based polyfill
url:require.resolve('native-url')});}function attachReactRefresh(webpackConfig,targetLoader){var _webpackConfig$module;let injections=0;const reactRefreshLoaderName='@next/react-refresh-utils/loader';const reactRefreshLoader=require.resolve(reactRefreshLoaderName);(_webpackConfig$module=webpackConfig.module)==null?void 0:_webpackConfig$module.rules.forEach(rule=>{const curr=rule.use;// When the user has configured `defaultLoaders.babel` for a input file:
if(curr===targetLoader){++injections;rule.use=[reactRefreshLoader,curr];}else if(Array.isArray(curr)&&curr.some(r=>r===targetLoader)&&// Check if loader already exists:
!curr.some(r=>r===reactRefreshLoader||r===reactRefreshLoaderName)){++injections;const idx=curr.findIndex(r=>r===targetLoader);// Clone to not mutate user input
rule.use=[...curr];// inject / input: [other, babel] output: [other, refresh, babel]:
rule.use.splice(idx,0,reactRefreshLoader);}});if(injections){Log.info(`automatically enabled Fast Refresh for ${injections} custom loader${injections>1?'s':''}`);}}async function getBaseWebpackConfig(dir,{buildId,config,dev=false,isServer=false,pagesDir,tracer,target='server',reactProductionProfiling=false,entrypoints,rewrites}){var _jsConfig,_jsConfig$compilerOpt,_config$conformance,_config$conformance$D,_jsConfig2,_jsConfig2$compilerOp,_webpackConfig$module2,_webpackConfig$module3;const productionBrowserSourceMaps=config.experimental.productionBrowserSourceMaps&&!isServer;let plugins=[];let babelPresetPlugins=[];const hasRewrites=rewrites.length>0||dev;if(config.experimental.plugins){plugins=await(0,_collectPlugins.collectPlugins)(dir,config.env,config.plugins);_nextPluginLoader.pluginLoaderOptions.plugins=plugins;for(const plugin of plugins){if(plugin.middleware.includes('babel-preset-build')){babelPresetPlugins.push({dir:plugin.directory,config:plugin.config});}}}const reactVersion=await(0,_getPackageVersion.getPackageVersion)({cwd:dir,name:'react'});const hasReactRefresh=dev&&!isServer;const hasJsxRuntime=Boolean(reactVersion)&&// 17.0.0-rc.0 had a breaking change not compatible with Next.js, but was
// fixed in rc.1.
_semver.default.gte(reactVersion,'17.0.0-rc.1');const distDir=_path.default.join(dir,config.distDir);const defaultLoaders={babel:{loader:'next-babel-loader',options:{isServer,distDir,pagesDir,cwd:dir,// Webpack 5 has a built-in loader cache
cache:!isWebpack5,babelPresetPlugins,development:dev,hasReactRefresh,hasJsxRuntime}},// Backwards compat
hotSelfAccept:{loader:'noop-loader'}};const babelIncludeRegexes=[/next[\\/]dist[\\/]next-server[\\/]lib/,/next[\\/]dist[\\/]client/,/next[\\/]dist[\\/]pages/,/[\\/](strip-ansi|ansi-regex)[\\/]/,...(config.experimental.plugins?_collectPlugins.VALID_MIDDLEWARE.map(name=>new RegExp(`src(\\\\|/)${name}`)):[])];// Support for NODE_PATH
const nodePathList=(process.env.NODE_PATH||'').split(process.platform==='win32'?';':':').filter(p=>!!p);const isServerless=target==='serverless';const isServerlessTrace=target==='experimental-serverless-trace';// Intentionally not using isTargetLikeServerless helper
const isLikeServerless=isServerless||isServerlessTrace;const outputDir=isLikeServerless?_constants2.SERVERLESS_DIRECTORY:_constants2.SERVER_DIRECTORY;const outputPath=_path.default.join(distDir,isServer?outputDir:'');const totalPages=Object.keys(entrypoints).length;const clientEntries=!isServer?{// Backwards compatibility
'main.js':[],[_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN]:`./`+_path.default.relative(dir,_path.default.join(_constants.NEXT_PROJECT_ROOT_DIST_CLIENT,dev?`next-dev.js`:'next.js')).replace(/\\/g,'/'),[_constants2.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS]:_path.default.join(_constants.NEXT_PROJECT_ROOT_DIST_CLIENT,'polyfills.js')}:undefined;let typeScriptPath;try{typeScriptPath=(0,_resolveRequest.resolveRequest)('typescript',`${dir}/`);}catch(_){}const tsConfigPath=_path.default.join(dir,'tsconfig.json');const useTypeScript=Boolean(typeScriptPath&&(await(0,_fileExists.fileExists)(tsConfigPath)));let jsConfig;// jsconfig is a subset of tsconfig
if(useTypeScript){const ts=await Promise.resolve(`${typeScriptPath}`).then(s=>_interopRequireWildcard(require(s)));const tsConfig=await(0,_getTypeScriptConfiguration.getTypeScriptConfiguration)(ts,tsConfigPath);jsConfig={compilerOptions:tsConfig.options};}const jsConfigPath=_path.default.join(dir,'jsconfig.json');if(!useTypeScript&&(await(0,_fileExists.fileExists)(jsConfigPath))){jsConfig=parseJsonFile(jsConfigPath);}let resolvedBaseUrl;if((_jsConfig=jsConfig)==null?void 0:(_jsConfig$compilerOpt=_jsConfig.compilerOptions)==null?void 0:_jsConfig$compilerOpt.baseUrl){resolvedBaseUrl=_path.default.resolve(dir,jsConfig.compilerOptions.baseUrl);}function getReactProfilingInProduction(){if(reactProductionProfiling){return{'react-dom$':'react-dom/profiling','scheduler/tracing':'scheduler/tracing-profiling'};}}const clientResolveRewrites=require.resolve('next/dist/next-server/lib/router/utils/resolve-rewrites');const resolveConfig={// Disable .mjs for node_modules bundling
extensions:isServer?['.js','.mjs',...(useTypeScript?['.tsx','.ts']:[]),'.jsx','.json','.wasm']:['.mjs','.js',...(useTypeScript?['.tsx','.ts']:[]),'.jsx','.json','.wasm'],modules:['node_modules',...nodePathList// Support for NODE_PATH environment variable
],alias:{// These aliases make sure the wrapper module is not included in the bundles
// Which makes bundles slightly smaller, but also skips parsing a module that we know will result in this alias
'next/head':'next/dist/next-server/lib/head.js','next/router':'next/dist/client/router.js','next/config':'next/dist/next-server/lib/runtime-config.js','next/dynamic':'next/dist/next-server/lib/dynamic.js',next:_constants.NEXT_PROJECT_ROOT,...(isWebpack5&&!isServer?{stream:require.resolve('stream-browserify'),path:require.resolve('path-browserify'),crypto:require.resolve('crypto-browserify'),buffer:require.resolve('buffer'),vm:require.resolve('vm-browserify')}:undefined),[_constants.PAGES_DIR_ALIAS]:pagesDir,[_constants.DOT_NEXT_ALIAS]:distDir,...getOptimizedAliases(isServer),...getReactProfilingInProduction(),[clientResolveRewrites]:hasRewrites?clientResolveRewrites:require.resolve('next/dist/client/dev/noop.js')},mainFields:isServer?['main','module']:['browser','module','main'],plugins:isWebpack5?// webpack 5+ has the PnP resolver built-in by default:
[]:[require('pnp-webpack-plugin')]};const webpackMode=dev?'development':'production';const terserOptions={parse:{ecma:8},compress:{ecma:5,warnings:false,// The following two options are known to break valid JavaScript code
comparisons:false,inline:2// https://github.com/vercel/next.js/issues/7178#issuecomment-493048965
},mangle:{safari10:true},output:{ecma:5,safari10:true,comments:false,// Fixes usage of Emoji and certain Regex
ascii_only:true}};const isModuleCSS=module=>{return(// mini-css-extract-plugin
module.type===`css/mini-extract`||// extract-css-chunks-webpack-plugin (old)
module.type===`css/extract-chunks`||// extract-css-chunks-webpack-plugin (new)
module.type===`css/extract-css-chunks`);};// Contains various versions of the Webpack SplitChunksPlugin used in different build types
const splitChunksConfigs={dev:{cacheGroups:{default:false,vendors:false,// In webpack 5 vendors was renamed to defaultVendors
defaultVendors:false}},prodGranular:{chunks:'all',cacheGroups:{default:false,vendors:false,// In webpack 5 vendors was renamed to defaultVendors
defaultVendors:false,framework:{chunks:'all',name:'framework',// This regex ignores nested copies of framework libraries so they're
// bundled with their issuer.
// https://github.com/vercel/next.js/pull/9012
test:/(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,priority:40,// Don't let webpack eliminate this chunk (prevents this chunk from
// becoming a part of the commons chunk)
enforce:true},lib:{test(module){return module.size()>160000&&/node_modules[/\\]/.test(module.identifier());},name(module){const hash=_crypto.default.createHash('sha1');if(isModuleCSS(module)){module.updateHash(hash);}else{if(!module.libIdent){throw new Error(`Encountered unknown module type: ${module.type}. Please open an issue.`);}hash.update(module.libIdent({context:dir}));}return hash.digest('hex').substring(0,8);},priority:30,minChunks:1,reuseExistingChunk:true},commons:{name:'commons',minChunks:totalPages,priority:20},shared:{name(module,chunks){return _crypto.default.createHash('sha1').update(chunks.reduce((acc,chunk)=>{return acc+chunk.name;},'')).digest('hex')+(isModuleCSS(module)?'_CSS':'');},priority:10,minChunks:2,reuseExistingChunk:true}},maxInitialRequests:25,minSize:20000}};// Select appropriate SplitChunksPlugin config for this build
let splitChunksConfig;if(dev){splitChunksConfig=splitChunksConfigs.dev;}else{splitChunksConfig=splitChunksConfigs.prodGranular;}const crossOrigin=config.crossOrigin;let customAppFile=await(0,_findPageFile.findPageFile)(pagesDir,'/_app',config.pageExtensions);if(customAppFile){customAppFile=_path.default.resolve(_path.default.join(pagesDir,customAppFile));}const conformanceConfig=Object.assign({ReactSyncScriptsConformanceCheck:{enabled:true},MinificationConformanceCheck:{enabled:true},DuplicatePolyfillsConformanceCheck:{enabled:true,BlockedAPIToBePolyfilled:Object.assign([],['fetch'],((_config$conformance=config.conformance)==null?void 0:(_config$conformance$D=_config$conformance.DuplicatePolyfillsConformanceCheck)==null?void 0:_config$conformance$D.BlockedAPIToBePolyfilled)||[])},GranularChunksConformanceCheck:{enabled:true}},config.conformance);function handleExternals(context,request,callback){if(request==='next'){return callback(undefined,`commonjs ${request}`);}const notExternalModules=['next/app','next/document','next/link','next/image','next/error','string-hash','next/constants'];if(notExternalModules.indexOf(request)!==-1){return callback();}// We need to externalize internal requests for files intended to
// not be bundled.
const isLocal=request.startsWith('.')||// Always check for unix-style path, as webpack sometimes
// normalizes as posix.
_path.default.posix.isAbsolute(request)||// When on Windows, we also want to check for Windows-specific
// absolute paths.
process.platform==='win32'&&_path.default.win32.isAbsolute(request);const isLikelyNextExternal=isLocal&&/[/\\]next-server[/\\]/.test(request);// Relative requires don't need custom resolution, because they
// are relative to requests we've already resolved here.
// Absolute requires (require('/foo')) are extremely uncommon, but
// also have no need for customization as they're already resolved.
if(isLocal&&!isLikelyNextExternal){return callback();}// Resolve the import with the webpack provided context, this
// ensures we're resolving the correct version when multiple
// exist.
let res;try{res=(0,_resolveRequest.resolveRequest)(request,`${context}/`);}catch(err){// If the request cannot be resolved, we need to tell webpack to
// "bundle" it so that webpack shows an error (that it cannot be
// resolved).
return callback();}// Same as above, if the request cannot be resolved we need to have
// webpack "bundle" it so it surfaces the not found error.
if(!res){return callback();}let isNextExternal=false;if(isLocal){// we need to process next-server/lib/router/router so that
// the DefinePlugin can inject process.env values
isNextExternal=/next[/\\]dist[/\\]next-server[/\\](?!lib[/\\]router[/\\]router)/.test(res);if(!isNextExternal){return callback();}}// `isNextExternal` special cases Next.js' internal requires that
// should not be bundled. We need to skip the base resolve routine
// to prevent it from being bundled (assumes Next.js version cannot
// mismatch).
if(!isNextExternal){// Bundled Node.js code is relocated without its node_modules tree.
// This means we need to make sure its request resolves to the same
// package that'll be available at runtime. If it's not identical,
// we need to bundle the code (even if it _should_ be external).
let baseRes;try{baseRes=(0,_resolveRequest.resolveRequest)(request,`${dir}/`);}catch(err){baseRes=null;}// Same as above: if the package, when required from the root,
// would be different from what the real resolution would use, we
// cannot externalize it.
if(!baseRes||baseRes!==res&&// if res and baseRes are symlinks they could point to the the same file
(0,_fs.realpathSync)(baseRes)!==(0,_fs.realpathSync)(res)){return callback();}}// Default pages have to be transpiled
if(!res.match(/next[/\\]dist[/\\]next-server[/\\]/)&&(res.match(/[/\\]next[/\\]dist[/\\]/)||// This is the @babel/plugin-transform-runtime "helpers: true" option
res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/))){return callback();}// Webpack itself has to be compiled because it doesn't always use module relative paths
if(res.match(/node_modules[/\\]webpack/)||res.match(/node_modules[/\\]css-loader/)){return callback();}// Anything else that is standard JavaScript within `node_modules`
// can be externalized.
if(isNextExternal||res.match(/node_modules[/\\].*\.js$/)){const externalRequest=isNextExternal?// Generate Next.js external import
_path.default.posix.join('next','dist',_path.default.relative(// Root of Next.js package:
_path.default.join(__dirname,'..'),res)// Windows path normalization
.replace(/\\/g,'/')):request;return callback(undefined,`commonjs ${externalRequest}`);}// Default behavior: bundle the code!
callback();}let webpackConfig={externals:!isServer?// make sure importing "next" is handled gracefully for client
// bundles in case a user imported types and it wasn't removed
// TODO: should we warn/error for this instead?
['next']:!isServerless?[isWebpack5?({context,request},callback)=>handleExternals(context,request,callback):(context,request,callback)=>handleExternals(context,request,callback)]:[// When the 'serverless' target is used all node_modules will be compiled into the output bundles
// So that the 'serverless' bundles have 0 runtime dependencies
'@ampproject/toolbox-optimizer'// except this one
],optimization:{// Webpack 5 uses a new property for the same functionality
...(isWebpack5?{emitOnErrors:!dev}:{noEmitOnErrors:dev}),checkWasmTypes:false,nodeEnv:false,splitChunks:isServer?false:splitChunksConfig,runtimeChunk:isServer?isWebpack5&&!isLikeServerless?{name:'webpack-runtime'}:undefined:{name:_constants2.CLIENT_STATIC_FILES_RUNTIME_WEBPACK},minimize:!(dev||isServer),minimizer:[// Minify JavaScript
new _terserWebpackPlugin.default({extractComments:false,cache:_path.default.join(distDir,'cache','next-minifier'),parallel:config.experimental.cpus||true,terserOptions}),// Minify CSS
new _cssMinimizerPlugin.CssMinimizerPlugin({postcssOptions:{map:{// `inline: false` generates the source map in a separate file.
// Otherwise, the CSS file is needlessly large.
inline:false,// `annotation: false` skips appending the `sourceMappingURL`
// to the end of the CSS file. Webpack already handles this.
annotation:false}}})]},context:dir,node:{setImmediate:false},// Kept as function to be backwards compatible
entry:async()=>{return{...(clientEntries?clientEntries:{}),...entrypoints,...(isServer?{'init-server.js':'next-plugin-loader?middleware=on-init-server!','on-error-server.js':'next-plugin-loader?middleware=on-error-server!'}:{})};},watchOptions:{ignored:['**/.git/**','**/node_modules/**','**/.next/**']},output:{...(isWebpack5?{environment:{arrowFunction:false,bigIntLiteral:false,const:false,destructuring:false,dynamicImport:false,forOf:false,module:false}}:{}),path:outputPath,// On the server we don't use the chunkhash
filename:isServer?'[name].js':`static/chunks/[name]${dev?'':'-[chunkhash]'}.js`,library:isServer?undefined:'_N_E',libraryTarget:isServer?'commonjs2':'assign',hotUpdateChunkFilename:isWebpack5?'static/webpack/[id].[fullhash].hot-update.js':'static/webpack/[id].[hash].hot-update.js',hotUpdateMainFilename:isWebpack5?'static/webpack/[fullhash].hot-update.json':'static/webpack/[hash].hot-update.json',// This saves chunks with the name given via `import()`
chunkFilename:isServer?`${dev?'[name]':'[name].[contenthash]'}.js`:`static/chunks/${dev?'[name]':'[name].[contenthash]'}.js`,strictModuleExceptionHandling:true,crossOriginLoading:crossOrigin,futureEmitAssets:!dev,webassemblyModuleFilename:'static/wasm/[modulehash].wasm'},performance:false,resolve:resolveConfig,resolveLoader:{// The loaders Next.js provides
alias:['emit-file-loader','error-loader','next-babel-loader','next-client-pages-loader','next-data-loader','next-serverless-loader','noop-loader','next-plugin-loader'].reduce((alias,loader)=>{// using multiple aliases to replace `resolveLoader.modules`
alias[loader]=_path.default.join(__dirname,'webpack','loaders',loader);return alias;},{}),modules:['node_modules',...nodePathList// Support for NODE_PATH environment variable
],plugins:isWebpack5?[]:[require('pnp-webpack-plugin')]},module:{rules:[...(isWebpack5?[// TODO: FIXME: do NOT webpack 5 support with this
// x-ref: https://github.com/webpack/webpack/issues/11467
{test:/\.m?js/,resolve:{fullySpecified:false}}]:[]),{test:/\.(tsx|ts|js|mjs|jsx)$/,include:[dir,...babelIncludeRegexes],exclude:excludePath=>{if(babelIncludeRegexes.some(r=>r.test(excludePath))){return false;}return /node_modules/.test(excludePath);},use:config.experimental.babelMultiThread?[// Move Babel transpilation into a thread pool (2 workers, unlimited batch size).
// Applying a cache to the off-thread work avoids paying transfer costs for unchanged modules.
{loader:'next/dist/compiled/cache-loader',options:{cacheContext:dir,cacheDirectory:_path.default.join(dir,'.next','cache','webpack'),cacheIdentifier:`webpack${isServer?'-server':''}`}},{loader:require.resolve('next/dist/compiled/thread-loader'),options:{workers:2,workerParallelJobs:Infinity}},hasReactRefresh?require.resolve('@next/react-refresh-utils/loader'):'',defaultLoaders.babel].filter(Boolean):hasReactRefresh?[require.resolve('@next/react-refresh-utils/loader'),defaultLoaders.babel]:defaultLoaders.babel}].filter(Boolean)},plugins:[hasReactRefresh&&new _ReactRefreshWebpackPlugin.default(),// Makes sure `Buffer` is polyfilled in client-side bundles (same behavior as webpack 4)
isWebpack5&&!isServer&&new _webpack.default.ProvidePlugin({Buffer:['buffer','Buffer']}),// Makes sure `process` is polyfilled in client-side bundles (same behavior as webpack 4)
isWebpack5&&!isServer&&new _webpack.default.ProvidePlugin({process:['process']}),// This plugin makes sure `output.filename` is used for entry chunks
!isWebpack5&&new _chunkNamesPlugin.default(),new _webpack.default.DefinePlugin({...Object.keys(process.env).reduce((prev,key)=>{if(key.startsWith('NEXT_PUBLIC_')){prev[`process.env.${key}`]=JSON.stringify(process.env[key]);}return prev;},{}),...Object.keys(config.env).reduce((acc,key)=>{if(/^(?:NODE_.+)|^(?:__.+)$/i.test(key)){throw new Error(`The key "${key}" under "env" in next.config.js is not allowed. https://err.sh/vercel/next.js/env-key-not-allowed`);}return{...acc,[`process.env.${key}`]:JSON.stringify(config.env[key])};},{}),'process.env.NODE_ENV':JSON.stringify(webpackMode),'process.env.__NEXT_CROSS_ORIGIN':JSON.stringify(crossOrigin),'process.browser':JSON.stringify(!isServer),'process.env.__NEXT_TEST_MODE':JSON.stringify(process.env.__NEXT_TEST_MODE),// This is used in client/dev-error-overlay/hot-dev-client.js to replace the dist directory
...(dev&&!isServer?{'process.env.__NEXT_DIST_DIR':JSON.stringify(distDir)}:{}),'process.env.__NEXT_TRAILING_SLASH':JSON.stringify(config.trailingSlash),'process.env.__NEXT_BUILD_INDICATOR':JSON.stringify(config.devIndicators.buildActivity),'process.env.__NEXT_PLUGINS':JSON.stringify(config.experimental.plugins),'process.env.__NEXT_STRICT_MODE':JSON.stringify(config.reactStrictMode),'process.env.__NEXT_REACT_MODE':JSON.stringify(config.experimental.reactMode),'process.env.__NEXT_OPTIMIZE_FONTS':JSON.stringify(config.experimental.optimizeFonts&&!dev),'process.env.__NEXT_OPTIMIZE_IMAGES':JSON.stringify(config.experimental.optimizeImages),'process.env.__NEXT_SCROLL_RESTORATION':JSON.stringify(config.experimental.scrollRestoration),'process.env.__NEXT_IMAGE_OPTS':JSON.stringify({deviceSizes:config.images.deviceSizes,imageSizes:config.images.imageSizes,path:config.images.path,loader:config.images.loader,...(dev?{// pass domains in development to allow validating on the client
domains:config.images.domains}:{})}),'process.env.__NEXT_ROUTER_BASEPATH':JSON.stringify(config.basePath),'process.env.__NEXT_HAS_REWRITES':JSON.stringify(hasRewrites),'process.env.__NEXT_I18N_SUPPORT':JSON.stringify(!!config.i18n),'process.env.__NEXT_I18N_DOMAINS':JSON.stringify(config.i18n.domains),'process.env.__NEXT_ANALYTICS_ID':JSON.stringify(config.analyticsId),...(isServer?{// Fix bad-actors in the npm ecosystem (e.g. `node-formidable`)
// This is typically found in unmaintained modules from the
// pre-webpack era (common in server-side code)
'global.GENTLY':JSON.stringify(false)}:undefined),// stub process.env with proxy to warn a missing value is
// being accessed in development mode
...(config.experimental.pageEnv&&process.env.NODE_ENV!=='production'?{'process.env':`
            new Proxy(${isServer?'process.env':'{}'}, {
              get(target, prop) {
                if (typeof target[prop] === 'undefined') {
                  console.warn(\`An environment variable (\${prop}) that was not provided in the environment was accessed.\nSee more info here: https://err.sh/next.js/missing-env-value\`)
                }
                return target[prop]
              }
            })
          `}:{})}),!isServer&&new _reactLoadablePlugin.ReactLoadablePlugin({filename:_constants2.REACT_LOADABLE_MANIFEST}),!isServer&&new _nextDropClientPagePlugin.DropClientPage(),// Moment.js is an extremely popular library that bundles large locale files
// by default due to how Webpack interprets its code. This is a practical
// solution that requires the user to opt into importing specific locales.
// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
config.future.excludeDefaultMomentLocales&&new _webpack.default.IgnorePlugin({resourceRegExp:/^\.\/locale$/,contextRegExp:/moment$/}),...(dev?(()=>{// Even though require.cache is server only we have to clear assets from both compilations
// This is because the client compilation generates the build manifest that's used on the server side
const{NextJsRequireCacheHotReloader}=require('./webpack/plugins/nextjs-require-cache-hot-reloader');const devPlugins=[new NextJsRequireCacheHotReloader()];if(!isServer){devPlugins.push(new _webpack.default.HotModuleReplacementPlugin());}return devPlugins;})():[]),// Webpack 5 no longer requires this plugin in production:
!isWebpack5&&!dev&&new _webpack.default.HashedModuleIdsPlugin(),!dev&&new _webpack.default.IgnorePlugin({resourceRegExp:/react-is/,contextRegExp:/(next-server|next)[\\/]dist[\\/]/}),isServerless&&isServer&&new _serverlessPlugin.ServerlessPlugin(),isServer&&new _pagesManifestPlugin.default(isLikeServerless),!isWebpack5&&target==='server'&&isServer&&new _nextjsSsrModuleCache.default({outputPath}),isServer&&new _nextjsSsrImport.default(),!isServer&&new _buildManifestPlugin.default({buildId,rewrites}),tracer&&new _profilingPlugin.ProfilingPlugin({tracer}),config.experimental.optimizeFonts&&!dev&&isServer&&function(){const{FontStylesheetGatheringPlugin}=require('./webpack/plugins/font-stylesheet-gathering-plugin');return new FontStylesheetGatheringPlugin();}(),config.experimental.conformance&&!isWebpack5&&!dev&&new _webpackConformancePlugin.default({tests:[!isServer&&conformanceConfig.MinificationConformanceCheck.enabled&&new _webpackConformancePlugin.MinificationConformanceCheck(),conformanceConfig.ReactSyncScriptsConformanceCheck.enabled&&new _webpackConformancePlugin.ReactSyncScriptsConformanceCheck({AllowedSources:conformanceConfig.ReactSyncScriptsConformanceCheck.allowedSources||[]}),!isServer&&conformanceConfig.DuplicatePolyfillsConformanceCheck.enabled&&new _webpackConformancePlugin.DuplicatePolyfillsConformanceCheck({BlockedAPIToBePolyfilled:conformanceConfig.DuplicatePolyfillsConformanceCheck.BlockedAPIToBePolyfilled}),!isServer&&conformanceConfig.GranularChunksConformanceCheck.enabled&&new _webpackConformancePlugin.GranularChunksConformanceCheck(splitChunksConfigs.prodGranular)].filter(Boolean)}),new _wellknownErrorsPlugin.WellKnownErrorsPlugin()].filter(Boolean)};// Support tsconfig and jsconfig baseUrl
if(resolvedBaseUrl){var _webpackConfig$resolv,_webpackConfig$resolv2;(_webpackConfig$resolv=webpackConfig.resolve)==null?void 0:(_webpackConfig$resolv2=_webpackConfig$resolv.modules)==null?void 0:_webpackConfig$resolv2.push(resolvedBaseUrl);}if(((_jsConfig2=jsConfig)==null?void 0:(_jsConfig2$compilerOp=_jsConfig2.compilerOptions)==null?void 0:_jsConfig2$compilerOp.paths)&&resolvedBaseUrl){var _webpackConfig$resolv3,_webpackConfig$resolv4;(_webpackConfig$resolv3=webpackConfig.resolve)==null?void 0:(_webpackConfig$resolv4=_webpackConfig$resolv3.plugins)==null?void 0:_webpackConfig$resolv4.unshift(new _jsconfigPathsPlugin.JsConfigPathsPlugin(jsConfig.compilerOptions.paths,resolvedBaseUrl));}if(isWebpack5){var _webpackConfig$output;// futureEmitAssets is on by default in webpack 5
(_webpackConfig$output=webpackConfig.output)==null?true:delete _webpackConfig$output.futureEmitAssets;// webpack 5 no longer polyfills Node.js modules:
if(webpackConfig.node)delete webpackConfig.node.setImmediate;if(dev){if(!webpackConfig.optimization){webpackConfig.optimization={};}webpackConfig.optimization.usedExports=false;}const nextPublicVariables=Object.keys(process.env).reduce((prev,key)=>{if(key.startsWith('NEXT_PUBLIC_')){return`${prev}|${key}=${process.env[key]}`;}return prev;},'');const nextEnvVariables=Object.keys(config.env).reduce((prev,key)=>{return`${prev}|${key}=${config.env[key]}`;},'');const configVars=JSON.stringify({crossOrigin:config.crossOrigin,pageExtensions:config.pageExtensions,trailingSlash:config.trailingSlash,buildActivity:config.devIndicators.buildActivity,plugins:config.experimental.plugins,reactStrictMode:config.reactStrictMode,reactMode:config.experimental.reactMode,optimizeFonts:config.experimental.optimizeFonts,optimizeImages:config.experimental.optimizeImages,scrollRestoration:config.experimental.scrollRestoration,basePath:config.basePath,pageEnv:config.experimental.pageEnv,excludeDefaultMomentLocales:config.future.excludeDefaultMomentLocales,assetPrefix:config.assetPrefix,target,reactProductionProfiling});const cache={type:'filesystem',// Includes:
//  - Next.js version
//  - NEXT_PUBLIC_ variable values (they affect caching) TODO: make this module usage only
//  - next.config.js `env` key
//  - next.config.js keys that affect compilation
version:`${"10.0.3"}|${nextPublicVariables}|${nextEnvVariables}|${configVars}`,cacheDirectory:_path.default.join(dir,'.next','cache','webpack')};// Adds `next.config.js` as a buildDependency when custom webpack config is provided
if(config.webpack&&config.configFile){cache.buildDependencies={config:[config.configFile]};}webpackConfig.cache=cache;// @ts-ignore TODO: remove ignore when webpack 5 is stable
webpackConfig.optimization.realContentHash=false;}webpackConfig=await(0,_config.build)(webpackConfig,{rootDirectory:dir,customAppFile,isDevelopment:dev,isServer,assetPrefix:config.assetPrefix||'',sassOptions:config.sassOptions,productionBrowserSourceMaps});let originalDevtool=webpackConfig.devtool;if(typeof config.webpack==='function'){webpackConfig=config.webpack(webpackConfig,{dir,dev,isServer,buildId,config,defaultLoaders,totalPages,webpack:_webpack.default});if(dev&&originalDevtool!==webpackConfig.devtool){webpackConfig.devtool=originalDevtool;devtoolRevertWarning(originalDevtool);}if(typeof webpackConfig.then==='function'){console.warn('> Promise returned in next config. https://err.sh/vercel/next.js/promise-in-next-config');}}// Backwards compat with webpack-dev-middleware options object
if(typeof config.webpackDevMiddleware==='function'){const options=config.webpackDevMiddleware({watchOptions:webpackConfig.watchOptions});if(options.watchOptions){webpackConfig.watchOptions=options.watchOptions;}}function canMatchCss(rule){if(!rule){return false;}const fileNames=['/tmp/test.css','/tmp/test.scss','/tmp/test.sass','/tmp/test.less','/tmp/test.styl'];if(rule instanceof RegExp&&fileNames.some(input=>rule.test(input))){return true;}if(typeof rule==='function'){if(fileNames.some(input=>{try{if(rule(input)){return true;}}catch(_){}return false;})){return true;}}if(Array.isArray(rule)&&rule.some(canMatchCss)){return true;}return false;}const hasUserCssConfig=(_webpackConfig$module2=(_webpackConfig$module3=webpackConfig.module)==null?void 0:_webpackConfig$module3.rules.some(rule=>canMatchCss(rule.test)||canMatchCss(rule.include)))!=null?_webpackConfig$module2:false;if(hasUserCssConfig){var _webpackConfig$module4,_webpackConfig$plugin,_webpackConfig$optimi,_webpackConfig$optimi2;// only show warning for one build
if(isServer){console.warn(_chalk.default.yellow.bold('Warning: ')+_chalk.default.bold('Built-in CSS support is being disabled due to custom CSS configuration being detected.\n')+'See here for more info: https://err.sh/next.js/built-in-css-disabled\n');}if((_webpackConfig$module4=webpackConfig.module)==null?void 0:_webpackConfig$module4.rules.length){// Remove default CSS Loader
webpackConfig.module.rules=webpackConfig.module.rules.filter(r=>{var _r$oneOf,_r$oneOf$;return!(typeof((_r$oneOf=r.oneOf)==null?void 0:(_r$oneOf$=_r$oneOf[0])==null?void 0:_r$oneOf$.options)==='object'&&r.oneOf[0].options.__next_css_remove===true);});}if((_webpackConfig$plugin=webpackConfig.plugins)==null?void 0:_webpackConfig$plugin.length){// Disable CSS Extraction Plugin
webpackConfig.plugins=webpackConfig.plugins.filter(p=>p.__next_css_remove!==true);}if((_webpackConfig$optimi=webpackConfig.optimization)==null?void 0:(_webpackConfig$optimi2=_webpackConfig$optimi.minimizer)==null?void 0:_webpackConfig$optimi2.length){// Disable CSS Minifier
webpackConfig.optimization.minimizer=webpackConfig.optimization.minimizer.filter(e=>e.__next_css_remove!==true);}}else{await(0,_overrideCssConfiguration.__overrideCssConfiguration)(dir,!dev,webpackConfig);}// Inject missing React Refresh loaders so that development mode is fast:
if(hasReactRefresh){attachReactRefresh(webpackConfig,defaultLoaders.babel);}// check if using @zeit/next-typescript and show warning
if(isServer&&webpackConfig.module&&Array.isArray(webpackConfig.module.rules)){let foundTsRule=false;webpackConfig.module.rules=webpackConfig.module.rules.filter(rule=>{if(!(rule.test instanceof RegExp))return true;if('noop.ts'.match(rule.test)&&!'noop.js'.match(rule.test)){// remove if it matches @zeit/next-typescript
foundTsRule=rule.use===defaultLoaders.babel;return!foundTsRule;}return true;});if(foundTsRule){console.warn('\n@zeit/next-typescript is no longer needed since Next.js has built-in support for TypeScript now. Please remove it from your next.config.js and your .babelrc\n');}}// Patch `@zeit/next-sass`, `@zeit/next-less`, `@zeit/next-stylus` for compatibility
if(webpackConfig.module&&Array.isArray(webpackConfig.module.rules)){;[].forEach.call(webpackConfig.module.rules,function(rule){if(!(rule.test instanceof RegExp&&Array.isArray(rule.use))){return;}const isSass=rule.test.source==='\\.scss$'||rule.test.source==='\\.sass$';const isLess=rule.test.source==='\\.less$';const isCss=rule.test.source==='\\.css$';const isStylus=rule.test.source==='\\.styl$';// Check if the rule we're iterating over applies to Sass, Less, or CSS
if(!(isSass||isLess||isCss||isStylus)){return;};[].forEach.call(rule.use,function(use){if(!(use&&typeof use==='object'&&(// Identify use statements only pertaining to `css-loader`
use.loader==='css-loader'||use.loader==='css-loader/locals')&&use.options&&typeof use.options==='object'&&(// The `minimize` property is a good heuristic that we need to
// perform this hack. The `minimize` property was only valid on
// old `css-loader` versions. Custom setups (that aren't next-sass,
// next-less or next-stylus) likely have the newer version.
// We still handle this gracefully below.
Object.prototype.hasOwnProperty.call(use.options,'minimize')||Object.prototype.hasOwnProperty.call(use.options,'exportOnlyLocals')))){return;}// Try to monkey patch within a try-catch. We shouldn't fail the build
// if we cannot pull this off.
// The user may not even be using the `next-sass` or `next-less` or
// `next-stylus` plugins.
// If it does work, great!
try{// Resolve the version of `@zeit/next-css` as depended on by the Sass,
// Less or Stylus plugin.
const correctNextCss=(0,_resolveRequest.resolveRequest)('@zeit/next-css',isCss?// Resolve `@zeit/next-css` from the base directory
`${dir}/`:// Else, resolve it from the specific plugins
require.resolve(isSass?'@zeit/next-sass':isLess?'@zeit/next-less':isStylus?'@zeit/next-stylus':'next'));// If we found `@zeit/next-css` ...
if(correctNextCss){// ... resolve the version of `css-loader` shipped with that
// package instead of whichever was hoisted highest in your
// `node_modules` tree.
const correctCssLoader=(0,_resolveRequest.resolveRequest)(use.loader,correctNextCss);if(correctCssLoader){// We saved the user from a failed build!
use.loader=correctCssLoader;}}}catch(_){// The error is not required to be handled.
}});});}// Backwards compat for `main.js` entry key
const originalEntry=webpackConfig.entry;if(typeof originalEntry!=='undefined'){webpackConfig.entry=async()=>{const entry=typeof originalEntry==='function'?await originalEntry():originalEntry;// Server compilation doesn't have main.js
if(clientEntries&&entry['main.js']&&entry['main.js'].length>0){const originalFile=clientEntries[_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN];entry[_constants2.CLIENT_STATIC_FILES_RUNTIME_MAIN]=[...entry['main.js'],originalFile];}delete entry['main.js'];return entry;};}if(!dev){// entry is always a function
webpackConfig.entry=await webpackConfig.entry();}return webpackConfig;}
//# sourceMappingURL=webpack-config.js.map