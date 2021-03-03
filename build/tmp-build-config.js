const path = require('path');
const fs = require('fs');

const TMP = 'node_modules/@lx/TMP-core';
if (!fs.existsSync(TMP)) {
	throw new Error(`TMP folder not found at ${TMP}`);
}

const UILibrary = path.resolve(path.join(TMP, 'src/library'));
const dist = path.resolve(path.join(TMP, 'dist'));
const distDev = path.resolve(path.join(TMP, 'dist_dev'));

if (!fs.existsSync(UILibrary)) {
	throw new Error(`TMP UI Library sources folder not found at ${UILibrary}`);
}

if (!fs.existsSync(dist) && !fs.existsSync(distDev)) {
	throw new Error(`TMP dist or dist_dev folder not found at ${dist} / ${distDev}`);
}

module.exports = {
	UILibrary,
	dist,
	distDev
};
