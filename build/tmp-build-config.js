const path = require('path');
const fs = require('fs');

const TMP = 'node_modules/tmp-core';
if (!fs.existsSync(TMP)) {
	throw new Error(`TMP folder not found at ${TMP}`);
}

const UILibrary = path.resolve(path.join(TMP, 'src/library'));
const CoreExports = path.resolve(path.join(TMP, 'src/core/@exports'));
const CoreExternals = path.resolve(path.join(CoreExports, 'build-externals.js'));
const dist = path.resolve(path.join(TMP, 'dist'));
const distDev = path.resolve(path.join(TMP, 'dist_dev'));

const lessFiles = {
	UIGeneralVariables: path.resolve(UILibrary, 'styles/@general.variables.less'),
	UIFormControlVariables: path.resolve(UILibrary, 'components/data-entry/form/styles/@tc-form-control.variables.less'),
	UITwfVariables: path.resolve(TMP, 'styles/index.less')
};

if (!fs.existsSync(UILibrary)) {
	throw new Error(`TMP UI Library sources folder not found at ${UILibrary}`);
}

if (!fs.existsSync(CoreExports)) {
	throw new Error(`TMP Core sources/exports folder not found at ${CoreExports}`);
}

if (!fs.existsSync(CoreExternals)) {
	throw new Error(`TMP Core build externals const file not found at ${CoreExternals}`);
}

if (!fs.existsSync(dist) && !fs.existsSync(distDev)) {
	throw new Error(`TMP dist or dist_dev folder not found at ${dist} / ${distDev}`);
}

if (!fs.existsSync(lessFiles.UIGeneralVariables)) {
	throw new Error(`TMP UIGeneralVariables file not found at ${lessFiles.UIGeneralVariables}`);
}
if (!fs.existsSync(lessFiles.UIFormControlVariables)) {
	throw new Error(`TMP UIFormControlVariables file not found at ${lessFiles.UIFormControlVariables}`);
}
if (!fs.existsSync(lessFiles.UITwfVariables)) {
	throw new Error(`TMP UITwfVariables file not found at ${lessFiles.UITwfVariables}`);
}

module.exports = {
	UILibrary,
	CoreExternals,
	dist,
	distDev,
	lessFiles
};
