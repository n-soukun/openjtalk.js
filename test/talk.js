const { OpenJTalk, VoiceOption } = require('../dist/index')

//インスタンスの作成
const openjtalk = new OpenJTalk()

//生成する音声の原稿
const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

//生成する音声の設定
const option = new VoiceOption({
    speaker : "mei_normal", // 話者         :必須オプション
    pitch : 0,              // ピッチシフト  :省略可能
    speed : 1,              // 話速         :省略可能
    allPath: 0.55,          // 声質         :省略可能
    intonation: 1,          // 抑揚         :省略可能
})

//音声を生成し再生
openjtalk.talk(str, option)
    .catch(console.error)