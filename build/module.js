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
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const supportedFileExtensions = ['gif', 'jpeg', 'jpg', 'png', 'docx', 'gz', 'log', 'pdf', 'pptx', 'txt', 'xlsx', 'zip'];
const issuePage = 'https://github.com/evertdespiegeleer/github-image-upload/issues/new';
let page;
const loginToGithub = (login) => __awaiter(this, void 0, void 0, function* () {
    yield page.type('#login_field', login.uname);
    yield page.type('#password', login.pw);
    yield Promise.all([page.click('[name="commit"]'), page.waitForNavigation()]);
    const loginError = yield page.evaluate(() => {
        return document.body.innerHTML.includes('Incorrect username or password');
    });
    if (loginError) {
        throw new Error('Incorrect username or password');
    }
});
const uploadImg = (img) => __awaiter(this, void 0, void 0, function* () {
    let url = '';
    try {
        yield fs_1.default.promises.access(img);
        let textInputElement = yield page.$("#issue_body");
        let filUploadElement = yield page.$('.manual-file-chooser');
        let imgExt = img.split('.')[img.split('.').length - 1];
        if (!supportedFileExtensions.includes(imgExt.toLowerCase())) {
            throw new Error('File extension not supported: .' + imgExt);
        }
        filUploadElement.uploadFile((img)); //upload the image
        yield page.waitForFunction('document.querySelector("#issue_body").value.includes("githubusercontent.com")');
        let text = yield (yield textInputElement.getProperty('value')).jsonValue();
        url = 'https://' + text.split('https://')[1].split(imgExt)[0] + imgExt;
        yield page.evaluate('(function clearInput() {document.querySelector("#issue_body").value = ""})()'); //clear the unput box
    }
    catch (error) {
        throw error;
    }
    return url;
});
const uploadFn = ((username, password, imgArr, cliSpinner) => __awaiter(this, void 0, void 0, function* () {
    (() => __awaiter(this, void 0, void 0, function* () {
        if (cliSpinner)
            cliSpinner.stop();
        yield fs_1.default.promises.access(__filename);
        if (cliSpinner)
            cliSpinner.start();
    }))();
    try {
        if (cliSpinner)
            cliSpinner.text = 'Connecting to Github';
        const browser = yield puppeteer_1.default.launch();
        page = yield browser.newPage();
        yield page.goto(issuePage);
        yield page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        if (cliSpinner)
            cliSpinner.text = 'Logging into Github';
        yield loginToGithub({
            uname: username,
            pw: password
        });
        if (cliSpinner)
            cliSpinner.text = 'Uploading image(s)';
        let response = [];
        for (let img of imgArr) {
            let imgData = new Object();
            imgData['localPath'] = img;
            imgData['publicUrl'] = yield uploadImg(img);
            response.push(imgData);
        }
        browser.close();
        if (cliSpinner)
            cliSpinner.stop();
        return response;
    }
    catch (e) {
        throw e;
    }
}));
exports.upload = uploadFn;
//# sourceMappingURL=module.js.map