const prompt = require('prompt-sync')();
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

console.log('');
console.log('');
console.log('*****************************');
console.log('**  TMP sub-app generator  **');
console.log('*****************************');
console.log('');

const confirm = prompt('Do you want to create new sub-application (y/N)? ');
if (confirm !== 'y' && confirm !== 'Y') {
	console.log('OK');
	process.exit(0);
}

console.log('Checking the environment...');

const TMPHostConfigFilename = './config/subapps.config.js';
if (!fs.existsSync(path.resolve(TMPHostConfigFilename))) {
	console.error(`Host\'s subapp.config.js file not found at ${TMPHostConfigFilename}`);
	process.exit(-1);
}
console.log('  [OK] Sub-app config file');

const TMPComposerConfigFilename = '../TMP-composer/config/subapps.config.js';
if (!fs.existsSync(path.resolve(TMPComposerConfigFilename))) {
	console.error(`Composer\'s subapp.config.js file not found at ${TMPComposerConfigFilename}`);
	process.exit(-1);
}
console.log('  [OK] Sub-app config file');

const TMPHostConfig = require(TMPHostConfigFilename);
if (!TMPHostConfig.template) {
	console.log('');
	console.log('ERROR');
	console.error(`[template] sub-app not found in ${TMPHostConfigFilename}`);
	process.exit(-1);
}
console.log('  [OK] Template section');

const TMPBuildConfigFilename = './build/webpack.config.js';
if (!fs.existsSync(path.resolve(TMPBuildConfigFilename))) {
	console.log('');
	console.log('ERROR');
	console.error(`webpack.config.js file not found at ${TMPBuildConfigFilename}`);
	process.exit(-1);
}
console.log('  [OK] Build config file');

const buildConfig = fs.readFileSync(TMPBuildConfigFilename).toString();

// const SubAppsBase = './../subapps';
const subAppsText = /const SubAppsBase\s*=\s*'([a-zA-Z0-9.\\/]*)';/gmi.exec(buildConfig)
if (!subAppsText || subAppsText.length < 2) {
	console.log('');
	console.log('ERROR');
	console.error(`const SubAppsBase not found in ${TMPBuildConfigFilename}`);
	process.exit(-1);
}
const subAppsFolder = path.resolve(subAppsText[1]);
if (!fs.existsSync(subAppsFolder)) {
	console.log('');
	console.log('ERROR');
	console.error(`Sub-apps folder not found at ${subAppsText[1]}`);
	process.exit(-1);
}
console.log('  [OK] Sub-apps folder');

if (!TMPHostConfig.template.dist) {
	console.log('');
	console.log('ERROR');
	console.error(`Source/dist folder is not specified in ${TMPHostConfig.template}`);
	process.exit(-1);
}

const sourceFolder = (TMPHostConfig.template.dist).replace(/\\/g, '/').split('/')[0];
const templateFolder = path.resolve(subAppsFolder, sourceFolder);
if (!fs.existsSync(templateFolder)) {
	console.log('');
	console.log('ERROR');
	console.error(`Source folder not found as ${sourceFolder}`);
	process.exit(-1);
}
console.log('  [OK] Source folder:', templateFolder);

console.log('');
console.log('Please type the name of new sub-app');
console.log('It should be valid JS variable name:');

const appName = prompt('> ');
try {
	eval(`var ${appName} = 'abc'`);
} catch {
	console.log('');
	console.log('ERROR');
	console.error(`Name ${appName} is invalid.`);
	process.exit(-1);
}

if (TMPHostConfig[appName]) {
	console.log('');
	console.log('ERROR');
	console.error(`Application ${appName} is already registered.`);
	process.exit(-1);
}

console.log('');
console.log('Please type the port for new sub-app online mode (80+):');

const sAppPort = prompt('> ');
const appPort = parseInt(sAppPort);

if (appPort < 80) {
	console.log('');
	console.log('ERROR');
	console.error(`Port ${sAppPort} is invalid.`);
	process.exit(-1);
}

Object.keys(TMPHostConfig).forEach(key => {
	if (TMPHostConfig[key].port === appPort) {
		console.log('');
		console.log('ERROR');
		console.error(`Port ${appPort} is already in use ("${key}").`);
		process.exit(-1);
	}
});

const destinationFolder = path.resolve(subAppsFolder, 'TMP-sub-' + appName);
if (fs.existsSync(destinationFolder)) {
	console.log('');
	console.log('ERROR');
	console.error(`Folder ${destinationFolder} already exists!`);
	process.exit(-1);
}

console.log('  [OK] Application name:', appName);
console.log('  [OK] Application port:', appPort);
console.log('');
console.log('Start processing...');

console.log('Copy:', templateFolder, '->', destinationFolder);
console.log('Please wait, it may take time');

fse.copySync(templateFolder, destinationFolder);
if (!fs.existsSync(destinationFolder)) {
	console.log('');
	console.log('ERROR');
	console.error(`Folder ${destinationFolder} is not copied!`);
	process.exit(-1);
}

console.log('');
console.log('Cleanup...');
cleanupAndCheck('.idea');
cleanupAndCheck('.git');
cleanupAndCheck('dist');
cleanupAndCheck('node_modules');
cleanupAndCheck('src/app/manual');
cleanupAndCheck('src/app/template');
cleanupAndCheck('src/app/home');

console.log('OK, garbage is removed.');

console.log('');
console.log('Replacing data...');
replaceInFile('README.md', TMPHostConfig.template.port, appPort);
replaceInFile('README.md', 'template', appName);
replaceInFile('README.md', 'Template', appName.toUpperCase());

replaceInFile('package.json', 'template', appName);

replaceInFile('docker-compose.start.yml', TMPHostConfig.template.port, appPort);
replaceInFile('docker-compose.watch.yml', TMPHostConfig.template.port, appPort);

replaceInFile('docker-compose.yml', 'tmp-sub-template', 'tmp-sub-' + appName);
replaceInFile('docker-compose.start.yml', 'tmp-sub-template', 'tmp-sub-' + appName);
replaceInFile('docker-compose.watch.yml', 'tmp-sub-template', 'tmp-sub-' + appName);

replaceInFile('docker_build.cmd', 'template', appName);

replaceInFile('build/app-config.js', 'template', appName);
replaceInFile('build/webpack.config.js', TMPHostConfig.template.port, appPort);

console.log('');
console.log('Done.');
console.log('Generating the files...');

fs.writeFileSync(path.resolve(destinationFolder, 'src/@index.tsx'), indexFile(appName), 'utf-8');
fs.writeFileSync(path.resolve(destinationFolder, 'src/index.less'), indexLessFile(appName), 'utf-8');

fse.mkdirpSync(path.resolve(destinationFolder, 'src/app/home'));
fse.mkdirpSync(path.resolve(destinationFolder, 'src/app/page'));

fs.writeFileSync(path.resolve(destinationFolder, 'src/app/home/index.tsx'), homeIndex(appName), 'utf-8');
fs.writeFileSync(path.resolve(destinationFolder, 'src/app/home/home.less'), homeLess(appName), 'utf-8');

fs.writeFileSync(path.resolve(destinationFolder, 'src/app/page/index.tsx'), pageIndex(appName), 'utf-8');
fs.writeFileSync(path.resolve(destinationFolder, 'src/app/page/page.less'), pageLess(appName), 'utf-8');

console.log('');
console.log('Done.');
console.log('Registering in the Host app...');

const registerLines = ` ${appName} : {
		name: '${appName}',
		dist: 'TMP-sub-${appName}/dist',
		port: ${appPort},
		homeCard: true,
		routes: [{
			path: '${appName}',
			view: '${appName}/page', // bundleName/viewName
			spineIcon: 'star',
			spineTitle: 'New application'
		}]
	},
};`;

replaceInFile(TMPHostConfigFilename, '};', registerLines, false);
console.log('Registering in the Composer app...');
fse.copySync(TMPHostConfigFilename, TMPComposerConfigFilename);

console.log('');
console.log('OK. Now you can try to build and run the application.');
console.log('You still need to run `npm install`.');

console.log('');
const confirmInstallAndBuild = prompt('Do you want this script will run `npm install` and `npm run build` (y/N)? ');
if (confirmInstallAndBuild !== 'y' && confirmInstallAndBuild !== 'Y') {
	console.log('OK, bye!');
	process.exit(0);
}

let cwd = path.resolve(destinationFolder);
execSync(`npm install`, {
	stdio: 'inherit',
	cwd
});

execSync(`npm run build:dev`, {
	stdio: 'inherit',
	cwd
});

console.log('');
console.log('DONE.');
console.log('Good luck!');

// -------------------------------------------------------------------------------------------------------------------
function cleanupAndCheck(folder) {
	console.log('Cleanup:', folder);

	if (fs.existsSync(path.resolve(destinationFolder, folder))) {
		fse.removeSync(path.resolve(destinationFolder, folder));
	}
	if (fs.existsSync(path.resolve(destinationFolder, folder))) {
		console.log('');
		console.log('ERROR');
		console.error(`Cannot delete ${folder} folder!`);
		process.exit(-1);
	}
}

function replaceInFile(file, what, to, resolve = true) {
	const fileName = resolve ? path.resolve(destinationFolder, file) : file;
	if (!fs.existsSync(fileName)) {
		console.log('');
		console.log('ERROR');
		console.error(`File not found at ${fileName}!`);
		process.exit(-1);
	}

	let content = fs.readFileSync(fileName, 'utf-8').toString();
	content = replaceAll(content, what, to);
	fs.writeFileSync(fileName, content, 'utf-8');
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function indexFile(appName) {
	return `import * as React from 'react';
import {ITmpCore} from 'TMPCore';
import {TmpSubApplication} from 'TMPUILibrary/tmp-sub-application';
import {AppPage} from './app/page';
import {AppHomeCard} from './app/home';

import './index.less';

declare global {
	interface Window {
		TmpCore: ITmpCore
	}
}

const SubApplication = new TmpSubApplication();

// register target subapp/view
SubApplication.registerSimpleView('${appName}/page', <AppPage/>);

// register view which will be automatically placed to home page
SubApplication.registerSimpleView('${appName}/home', <AppHomeCard/>);
`;
}

function indexLessFile(appName) {
	return `@import "app/home/home.less";
@import "app/page/page.less";
`;
}

function homeIndex(appName) {
	return `import * as React from 'react';

export const AppHomeCard: React.FC = () => {
	return <div className={'app-${appName}-home-card'}>
		<h1>Hello from ${appName}!</h1>
	</div>;
};

`;
}

function homeLess(appName) {
	return `@import '~UITwfVariables';

.app-${appName}-home-card {
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
	background: @twf-primary-blue linear-gradient(@twf-primary-blue, @twf-primary-blue-shade1);
	width: 30em;
	height: 100%;
	color: #fff;
}

`;
}

function pageIndex(appName) {
	return `import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {TcNavAnchor} from 'TMPUILibrary/navigation';

export const AppPage: React.FC = () => {
	return <>
		<TcViewTitle>
			Sub-app template: ${appName}
		</TcViewTitle>
		<TcSmartLayout navigationMode={'scroll'} layoutClassName={'template-manual'}>
			<TcNavAnchor>Overview</TcNavAnchor>
		</TcSmartLayout>
	</>;
};

`;
}

function pageLess(appName) {
	return `// place styles here
.sub-app-${appName} {

}

`;
}
