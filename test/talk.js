const openjtalk = require('../dist/index')

//生成する音声の原稿
const text = "こんにちは、これはOpenJTalkによって生成された音声です。"

//HTSボイスファイルのパスを取得
const mei_normal = openjtalk.getSpeaker("mei_normal")

//生成する音声の設定
const option = {
    speaker : mei_normal,   // 話者(m) ※HTSボイスファイルへのパスを指定してください
    formant: 0.55,          // 声質(a)
    pitch : 0,              // ピッチシフト(fm)
    speed : 1,              // 話速(r)
    intonation: 1,          // 抑揚(jf)
}

//音声を生成し再生
openjtalk.talk(text, option)
    .catch(console.error)