const { OpenJTalk, VoiceOption } = require('../dist/index')

//インスタンスの作成
const openjtalk = new OpenJTalk()

//生成する音声の原稿
const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

//生成する音声の設定
const option = new VoiceOption({
    speaker : "mei_normal", // 話者             :必須オプション
    voiceQuality: 0.55,     // 声質(a)          :省略可能
    pitch : 0,              // ピッチシフト(fm)  :省略可能
    speed : 1,              // 話速(r)          :省略可能
    intonation: 1,          // 抑揚(jf)         :省略可能
})

//音声を生成し再生
openjtalk.talk(str, option)
    .catch(console.error)