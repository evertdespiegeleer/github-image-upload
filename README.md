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

> npm module to, probably without permission, use the github servers as image service

## Install

```sh
npm install github-image-upload
```

## Usage

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
})
```

## Author

👤 **Evert De Spiegeleer**

* Twitter: [@eds1999](https://twitter.com/eds1999)
* Github: [@evertdespiegeleer](https://github.com/evertdespiegeleer)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/evertdespiegeleer/github-image-upload/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Evert De Spiegeleer](https://github.com/evertdespiegeleer).<br />
This project is [GNU](https://www.gnu.org/licenses/gpl-3.0.nl.html) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_