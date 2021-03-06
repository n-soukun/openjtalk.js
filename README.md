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
const { OpenJTalk, VoiceOption } = require('openjtalk.js')

const openjtalk = new OpenJTalk()

const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

const option = new VoiceOption({
    speaker : "mei_normal", //required
    voiceQuality: 0.55,     //optional
    pitch : 0,              //optional
    speed : 1,              //optional
    intonation: 1,          //optional
})

openjtalk.talk(str, option)
    .catch(console.error)
```

# License
MIT License (see `LICENSE` file).