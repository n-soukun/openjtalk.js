const { OpenJTalk, VoiceOption } = require('../dist/index')

const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

const option = new VoiceOption({
    speaker : "mei_normal", // 必須オプション
    pitch : 200,            // 省略可能
    speed : 1               // 省略可能
})

const openjtalk = new OpenJTalk()

openjtalk.talk(str, option)
.catch(console.error)