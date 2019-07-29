<h1 align="center">github-image-upload</h1>
<p>
  <img alt="Version" src="https://img.shields.io/npm/v/github-image-upload.svg">
  <a href="https://www.gnu.org/licenses/gpl-3.0.nl.html">
    <img alt="License: GNU" src="https://img.shields.io/badge/License-GNU-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/eds1999">
    <img alt="Twitter: eds1999" src="https://img.shields.io/twitter/follow/eds1999.svg?style=social" target="_blank" />
  </a>
</p>

> npm module to use the github servers as an image cdn, hosting the images for the README file, and thus keeping gits as small as possible

<img src="https://user-images.githubusercontent.com/1685680/61972941-1833dd80-afe3-11e9-991f-38d0d505d88a.gif" width="9000"/>

# About
A nice README is important. If you're reading this, you probably know that. Markdown, the markup language of the README-file isn't exactly *that* flexible however. Some html is supported, but it's pretty restrictive. The usual way to make your README-file stand out is by the use of pictures. For some stores, it's even necessary to have high-res screenshots in your README. However, dropping high-res images into your git will make your awesome codebase seem really big, heavy and unorganised. Hosting your images on third-party sites is an option, but it isn't exactly easy, and it's by no means reliable. github-image-upload enables you to very easily use the Github servers themselves to host the images for your README, without even having to leave your IDE.

This package is based on a [gist](https://gist.github.com/vinkla/dca76249ba6b73c5dd66a4e986df4c8d) from [@vinkla](https://github.com/vinkla)

# Install

locally, usually for use as a module:
```sh
npm i github-image-upload
```

globally, usually for use as a command line application:
```sh
npm i github-image-upload -g
```
# Usage

### Command line for projects

**github-image-upload** is primarily designed to be used as a command line application.

To do so, the package has to be **installed globally**.

In your project folder, run the init command
```sh
github-image-upload --init
```

This will create a folder calles ```.ghimages```.
Inside of this folder, there's a config file called ```ghimages.config.js```, which looks like this:

```javascript
module.exports = {
     'username': 'GITHUB_USERNAME',
     'password': 'GITHUB_PASSWORD',
     'readme_file': '../README.md'
};
```

In this file, the github username and github password, as well as the location of the README.md file should be configured. 
For most projects, the default ```'../README.md'``` should be correct.

The entire ```.ghimages```-folder is automatically added to ```.gitignore```. This keeps your Github-credentials safe from accidentally being pushed to Github. When publishing your code on other platforms however, handle ```.ghimages``` with care. It should never be published.

When adding images to your README.md, put the image files in the .ghimages folder. Include them into the README.md locally like you normally would, eg.:

```markdown
![a nice image](./.ghimages/aReallyNiceImage.png)
```

To convert upload these images to Github and replace the local references in your README.md with references to the public Github-url's, use the following command:

```sh
github-image-upload -c
```

When new, local images are found, this command takes ~ 3.5s, plus the upload time for each image. When no new local images are found however, this is very fast, meaning that is can perfectly be included in a build sequice, eg.:

*package.json:*
```json
...
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./build/index.js",
    "build": "webpack && tsc && npm run ghimage",
    "ghimage": "github-image-upload -c"
},
...
```

In this example, when running ```npm run build``` or ```npm run ghimage```, **github-image-upload** will do its thing. When using the package this way, as an npm script, a global installation is not needed. The prefered way to install would then be as a dev-dependency:

```sh
npm i github-image-upload --save-dev
```

### Command line interactive

Outside of project folders, the tool can also be used interactively:

```
github-image-upload -i
```

### As a module

```js
import { upload as ghUpload } from 'github-image-upload'

(async () => {
    const imgUrls = await ghUpload('GITHUB_USERNAME', 'GITHUB_PASSWORD', ['path/to/image1.png', 'path/to/image2.gif'])
    /*
    [{
      "localPath": "path/to/image1.png",
      "publicUrl": "https://user-images.githubusercontent.com/path/toPublicImage1.png"
    }, 
    {
      "localPath": "path/to/image2.gif",
      "publicUrl": "https://user-images.githubusercontent.com/path/toPublicImage2.gif"
    }]
    */
})()
```

# Notice
I don't think it's explicitly stated anywhere, but given the fact that this service exists and there's no API, I assume Github doesn't exactly *want* you to use their image-hosting service this way. Many famous repos seem to use it [manually](https://gist.github.com/vinkla/dca76249ba6b73c5dd66a4e986df4c8d) so it doesn't look like Github has any problem with you using it, but if they would've *wanted* you to be able to use it automatically, I assume they would've written an API. 

**github-image-upload** automates the manual process, but it doesn't use an API, it rather [acts like it is a human being](https://github.com/GoogleChrome/puppeteer). Github, in other words, has no way of knowing whether your computer uploads images automatically, or whether you do it manually. This technique is called web scraping. Although it's used very extensively, there has been quite a bit of [legal debate](https://en.wikipedia.org/wiki/Web_scraping#Legal_issues) about it. Sooo, just to be safe: I'm not _advising_ you to use this package.

# Author

👤 **Evert De Spiegeleer**

* Twitter: [@eds1999](https://twitter.com/eds1999)
* Github: [@evertdespiegeleer](https://github.com/evertdespiegeleer)

# 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/evertdespiegeleer/github-image-upload/issues).

# Show your support

Give a ⭐️ if this project helped you!

# 📝 License

Copyright © 2019 [Evert De Spiegeleer](https://github.com/evertdespiegeleer).<br />
This project is [GNU](https://www.gnu.org/licenses/gpl-3.0.nl.html) licensed.

# :coffee: Coffee!
[<img src="https://user-images.githubusercontent.com/1685680/61808727-4925de00-ae3c-11e9-9d60-66bef358fd8e.png" alt="drawing" width="180"/>](https://www.buymeacoffee.com/evertds "Buy me a coffee")