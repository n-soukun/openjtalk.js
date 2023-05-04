const openjtalk = require('../dist/index')
const fs = require('fs')
const { execFile } = require('child_process')
const path = require('path')

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

//ストリームの取得
openjtalk.buffer(text, option)
.then(buffer => {
    //音声ファイルの生成
    const wavPath = path.join(__dirname, "./test.wav")
    fs.writeFileSync(wavPath, buffer)

    switch (process.platform) {
        case "darwin":
            playAndRefresh("afplay", wavPath)
            break;
        case "linux":
            playAndRefresh("aplay", wavPath)
            break;
        default:
            console.error("Playback on this OS is not supported.")
            break;
    }
})

//コマンドの実行とファイルの削除
function playAndRefresh(com, path){
    execFile(com, [path],()=>{
        fs.unlinkSync(path)
    })
}