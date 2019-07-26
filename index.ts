#!/usr/bin/env node

import { upload } from './module'
import { init as cliInit } from './cli'

//Check if called by command line or as module
if (require.main === module) {
    //Command line
    cliInit()
} else {
    //module
}

export { upload }