# OpenJTalk.js: A TTS module with Open JTalk for Node.js
OpenJTalk.js is a library of OpenJTalk commands made easy to use in node.js.

# Requirement
`Open JTalk`

# Installation
``` shell
$ brew install openjtalk # For MacOS(*)
$ npm i openjtalk.js
```
(*) For other operating systems, download and build Open Jtalk and pass it through.
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

openjtalk.talk(str, option) // For MacOS or Linux
    .catch(console.error)
```

# License
MIT License (see `LICENSE` file).