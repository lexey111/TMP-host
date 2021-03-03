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

if (!fs.existsSync(UILibrary)) {
	throw new Error(`TMP UI Library sources folder not found at ${UILibrary}`);
}

if (!fs.existsSync(CoreExports)) {
	throw new Error(`TMP Core sources/exports folder not found at ${CoreExports}`);
}

if (!fs.existsSync(CoreExternals)) {
	throw new Error(`TMP Core build externals consts file not found at ${CoreExternals}`);
}

if (!fs.existsSync(dist) && !fs.existsSync(distDev)) {
	throw new Error(`TMP dist or dist_dev folder not found at ${dist} / ${distDev}`);
}

module.exports = {
	UILibrary,
	CoreExternals,
	dist,
	distDev
};
