"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("./module");
const clipboardy_1 = __importDefault(require("clipboardy"));
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
function askQuestion(query) {
    let rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query + '\n', ans => {
        rl.close();
        resolve(ans);
    }));
}
const args = process.argv.splice(process.execArgv.length + 2);
const initInteractive = () => __awaiter(this, void 0, void 0, function* () {
    console.log(`Let's upload some images to the Github cdn!\n`);
    const uname = yield askQuestion(`What is your Github ${chalk_1.default.blue('username')}?`);
    const pw = yield askQuestion(`What is your Github ${chalk_1.default.blue('password')}?`);
    let uploadImages = true;
    while (uploadImages) {
        let filePath = yield askQuestion(`${chalk_1.default.blue('Drop the image')} you would like to upload to Github and press [enter]`);
        console.log('\n');
        let operationSpinner = ora_1.default().start();
        try {
            let response = yield module_1.upload(uname, pw, [filePath], operationSpinner);
            let url = response[0].publicUrl;
            console.log(`Image publicly available at ${chalk_1.default.yellow(url)}`);
            operationSpinner.text = 'Copying to clipboard';
            operationSpinner.start();
            yield clipboardy_1.default.write(url);
            operationSpinner.stop();
            console.log('✅  Copied to clipboard!');
            console.log('\n');
            let newImg = yield askQuestion(`Upload another image? Type Y/n and press [enter]`);
            if (newImg.split('')[0].toLowerCase() != 'y') {
                uploadImages = false;
            }
        }
        catch (e) {
            operationSpinner.stop();
            console.error(`${chalk_1.default.red('Whoops!\n ==> ')}${e}`);
            process.exit(0);
        }
    }
    process.exit(0);
});
const outputHelp = () => {
    console.log([
        'Usage: github-image-upload [options]',
        '',
        'Options:',
        '    -h, --help    Output usage information',
        '    -i            An interactive cli will be launched',
        '    --init        Generate scaffold .ghimages folder in the project root and add to .gitignore',
        '    -c            Check README for local images inside of .ghimages, convert to Github hosted ones',
        '',
    ].join('\n'));
};
const initArgsProvided = (args) => {
    let n = '\n';
    if (args.includes('--help') || args.includes('-h')) {
        outputHelp();
    }
    else if (args.includes('-i')) {
        initInteractive();
    }
    else if (args.includes('--init')) {
        const workingDir = process.cwd();
        fs_1.default.stat(`${workingDir}/.ghimages`, function (err) {
            if (!err) {
                console.log('It seems like github-image-upload has already been initialised in this project folder.\nIn some file explorers the .ghimages folder might be hidden.\nRun github-image-upload --help to lean more.');
            }
            else if (err.code === 'ENOENT') {
                //Not initialised yet
                const spinner = ora_1.default().start();
                spinner.text = 'Creating .ghimages folder...';
                mkdirp_1.default(`${workingDir}/.ghimages`, function (err) {
                    if (err) {
                        spinner.stop();
                        throw err;
                    }
                    else {
                        spinner.text = 'Generating .ghimages/ghimages.config.js...';
                        fs_1.default.writeFile(`${workingDir}/.ghimages/ghimages.config.js`, `module.exports = {\n     'username': 'YOUR_GH_USERNAME',\n     'password': 'YOUR_GH_PASSWORD',\n     'readme_file': '../README.md'\n};`, (err) => {
                            if (err) {
                                spinner.stop();
                                throw err;
                            }
                            else {
                                spinner.text = 'Adding .ghimages to .gitignore...';
                                fs_1.default.stat(`${workingDir}/.gitignore`, function (err) {
                                    if (!err) {
                                        fs_1.default.appendFile(`${workingDir}/.gitignore`, '\n.ghimages/*\n.ghimages', (err) => {
                                            if (err) {
                                                spinner.stop();
                                                throw (err);
                                                return;
                                            }
                                            spinner.stop();
                                            console.log('✅  Init complete! Images can be added to the (sometimes hidden) .gitignore folder.');
                                        });
                                    }
                                    else if (err.code === 'ENOENT') {
                                        spinner.text = 'No .gitignore file found, generating .gitignore...';
                                        fs_1.default.writeFile(`${workingDir}/.gitignore`, '\n.ghimages/*\n.ghimages', (err) => {
                                            if (err) {
                                                spinner.stop();
                                                throw (err);
                                                return;
                                            }
                                            spinner.stop();
                                            console.log('✅  Init complete! Images can be added to the (sometimes hidden) .gitignore folder.');
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else if (args.includes('-c')) {
        const workingDir = process.cwd() + '/';
        const spinner = ora_1.default().start();
        const procToReadme = (config) => {
            spinner.text = "Loading readme file...";
            fs_1.default.readFile(path_1.default.join('./.ghimages', config.readme_file), function (err, data) {
                if (err)
                    throw err;
                spinner.text = "Scanning readme for local images...";
                const detectImgsFromText = (text) => {
                    const supportedFileExtensions = ['gif', 'jpeg', 'jpg', 'png', 'GIF', 'JPEG', 'JPG', 'PNG'];
                    let imgPaths = [];
                    const dat = text;
                    for (const extension of supportedFileExtensions) {
                        const spl = dat.split('.' + extension);
                        spl.pop();
                        for (const splEl of spl) {
                            const spl2 = splEl.split("(");
                            const spl3 = spl2[spl2.length - 1].split('"');
                            const img = spl3[spl3.length - 1] + '.' + extension;
                            imgPaths.push(img);
                        }
                    }
                    return imgPaths;
                };
                const filterLocalGhImages = (images) => {
                    let returnArr = [];
                    for (const imagePath of images) {
                        if (!(imagePath.substring(0, 4) === 'http') && imagePath.includes('ghimages/')) {
                            returnArr.push(imagePath);
                        }
                    }
                    return returnArr;
                };
                const detectedImages = detectImgsFromText(String(data));
                const localImages = filterLocalGhImages(detectedImages);
                spinner.stop();
                console.log(`Local images detected in README: ${localImages}`);
                spinner.start();
                spinner.text = "Starting conversion to public Github-hosted images...";
                if (localImages.length <= 0) {
                    spinner.stop();
                    console.log(`✅  No local images found in README, you're good to go!.`);
                }
                else {
                    const convert = () => __awaiter(this, void 0, void 0, function* () {
                        const generatedUrls = yield module_1.upload(config.username, config.password, localImages, spinner);
                        //spinner.start()
                        spinner.text = 'Replacing paths in README file...';
                        let newReadmeConent = String(data);
                        for (const obj of generatedUrls) {
                            let allReplaced = false;
                            while (!allReplaced) {
                                newReadmeConent = newReadmeConent.replace(obj.localPath, obj.publicUrl);
                                if (!newReadmeConent.includes(obj.localPath)) {
                                    allReplaced = true;
                                }
                            }
                        }
                        spinner.text = 'Writing new README file...';
                        fs_1.default.writeFile(path_1.default.join('./.ghimages', config.readme_file), newReadmeConent, (err) => {
                            if (err) {
                                throw err;
                            }
                            spinner.stop();
                            console.log(`✅  Readme file converted! ${generatedUrls.length} local image url's have been replaced by public, github-hosted ones.`);
                        });
                    });
                    convert();
                }
            });
        };
        try {
            spinner.text = 'Reading config file...';
            const config = require(`${workingDir}/.ghimages/ghimages.config.js`);
            procToReadme(config);
        }
        catch (e) {
            spinner.stop();
            console.log('The ghimages.config.js file could not be read. Was github-image-upload properly initialized in this project folder?.\nRun github-image-upload --help to lean more\nRun github-image-upload --init to initialize more.');
            console.log(e);
        }
    }
    else {
        outputHelp();
    }
};
const init = () => {
    if (args.length === 0) {
        //No args specified
        outputHelp();
    }
    else {
        initArgsProvided(args);
    }
};
exports.init = init;
//# sourceMappingURL=cli.js.map