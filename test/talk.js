const { OpenJTalk, VoiceOption } = require('../dist/index')

//生成する音声の原稿
const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

//生成する音声の設定
const option = new VoiceOption({
    speaker : "mei_normal", // 必須オプション
    pitch : 200,            // 省略可能
    speed : 1               // 省略可能
})

//インスタンスの作成
const openjtalk = new OpenJTalk()

//音声を生成し再生
openjtalk.talk(str, option)
    .catch(console.error)