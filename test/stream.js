const { OpenJTalk, VoiceOption } = require('../dist/index')
const fs = require('fs')
const { execFile } = require('child_process')
const path = require('path')

//生成する音声の原稿
const str = "こんにちわ、これはOpenJTalkによって生成された音声です。"

//オプションの設定
const option = new VoiceOption({
    speaker : "mei_normal", // 必須オプション
    pitch : 200,            // 省略可能
    speed : 1               // 省略可能
})

//インスタンスの作成
const openjtalk = new OpenJTalk()

//ストリームの取得
const audioStream = openjtalk.stream(str, option)

//音声ファイルの生成
const wavPath = path.join(__dirname, "./test.wav")
const outFile = fs.createWriteStream(wavPath)
audioStream.pipe(outFile)

//音声ファイルの生成が終了すると実行
audioStream.on("close", ()=>{
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