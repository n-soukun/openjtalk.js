const { runOpenJTalk, VoiceOption } = require('../dist/index')

const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

const option = new VoiceOption({
    voice : "mei_normal", // 必須オプション
    pitch : 200,          // 省略可能
    speed : 1           // 省略可能
})

runOpenJTalk(str, option)
.then(async result=>{
    result.play()
    .then(()=>{
        result.close()
    })
})
.catch(console.error)