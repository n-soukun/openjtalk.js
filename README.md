# OpenJTalk.js: A TTS module with Open JTalk for Node.js
OpenJTalk.js is a library of OpenJTalk commands made easy to use in node.js.

# Requirement
* MacOS or Linux
* Node.js

# Installation
``` shell
$ npm i openjtalk.js
```
# Usage
``` javascript
const openjtalk = require('openjtalk.js')

const text = "こんにちは、これはOpenJTalkによって生成された音声です。"

const option = {
    speaker : "mei_normal",
    voiceQuality: 0.55,
    pitch : 0,
    speed : 1,
    intonation: 1,
}

openjtalk.talk(text, option)
    .catch(console.error)
```

# License
MIT License (see `LICENSE` file).