import puppeteer from 'puppeteer'
import fs from 'fs'
import ora from 'ora'

const supportedFileExtensions = ['gif','jpeg','jpg','png','docx','gz','log','pdf','pptx','txt','xlsx','zip'];

const issuePage = 'https://github.com/evertdespiegeleer/github-image-upload/issues/new'

let page: puppeteer.Page

declare type login = {
    uname: string,
    pw: string
}

const loginToGithub = async (login: login): Promise<void> => {
    await page.type('#login_field', login.uname)
    await page.type('#password', login.pw)
    await Promise.all([page.click('[name="commit"]'), page.waitForNavigation()])
    const loginError = await page.evaluate(() => {
        return document.body.innerHTML.includes('Incorrect username or password')
    })
    if(loginError) {
        throw new Error('Incorrect username or password')
    }
}

const uploadImg = async (img: string): Promise<string> => {
    let url: string = ''
    try {
        await fs.promises.access(img);
        let textInputElement = await page.$("#issue_body") as puppeteer.ElementHandle
        let filUploadElement = await page.$('.manual-file-chooser') as puppeteer.ElementHandle
        let imgExt = img.split('.')[img.split('.').length-1];
        if(!supportedFileExtensions.includes(imgExt.toLowerCase())) {
            throw new Error('File extension not supported: .' + imgExt)
        }
        filUploadElement.uploadFile((img)) //upload the image
        await page.waitForFunction('document.querySelector("#issue_body").value.includes("githubusercontent.com")')
        let text = await (await textInputElement.getProperty('value')).jsonValue()
        url = 'https://' + text.split('https://')[1].split(imgExt)[0] + imgExt
        await page.evaluate('(function clearInput() {document.querySelector("#issue_body").value = ""})()') //clear the unput box
    } catch (error) {
        throw error
    }
    return url
}

interface Object {
    localPath?: string
    publicUrl?: string
}

interface Console {
    mute?: void

}

const uploadFn = (async (username:string, password:string, imgArr: Array<string>, cliSpinner?: ora.Ora) : Promise<Array<Object>> => {
    (async ()=> { //show warning at the beginning
    if(cliSpinner)
    cliSpinner.stop()
    await fs.promises.access(__filename)
    if(cliSpinner)
    cliSpinner.start()
    })()
    try {
        if (cliSpinner)
        cliSpinner.text = 'Connecting to Github'
        const browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(issuePage);
        await page.setRequestInterception(true);
        page.on('request', (req) => { //No need to be stylish when you're fast
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    })
    if (cliSpinner)
    cliSpinner.text = 'Logging into Github'
    await loginToGithub({
        uname: username,
        pw: password
    })
    if (cliSpinner)
    cliSpinner.text = 'Uploading image(s)'
    let response: Array<Object> = []
    for (let img of imgArr) {
        let imgData:any = new Object()
        imgData['localPath'] = img
        imgData['publicUrl'] = await uploadImg(img)
        response.push(imgData)
    }
    browser.close()
    if (cliSpinner)
    cliSpinner.stop()
    return response
}
catch(e) {
    throw e
}
})

export {uploadFn as upload}