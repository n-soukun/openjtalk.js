const { runOpenJTalk, VoiceOption } = require('../dist/index')

const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

const option = new VoiceOption({
    speaker : "mei_normal", // 必須オプション
    pitch : 200,            // 省略可能
    speed : 1               // 省略可能
})

runOpenJTalk(str, option)
.then(result=>{
    result.play() // For MacOS or Linux
    .then(()=>{
        result.close()
    })
})
.catch(console.error)