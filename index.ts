import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
dotenv.config();

const supportedFileExtensions = ['gif','jpeg','jpg','png','docx','gz','log','pdf','pptx','txt','xlsx','zip'];

const issuePage = 'https://github.com/electron/apps/issues/new'

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

const uploadFn = (async (username:string, password:string, imgArr: Array<string>) : Promise<Array<Object>> => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(issuePage);
    await loginToGithub({
        uname: username,
        pw: password
    })
    let response: Array<Object> = []
    for (let img of imgArr) {
        let imgData:any = new Object()
        imgData['localPath'] = img
        imgData['publicUrl'] = await uploadImg(img)
        response.push(imgData)
    }
    browser.close()
    return response
})

export {uploadFn as upload}