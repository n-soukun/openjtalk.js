# OpenJTalk.js: A TTS module with OpenJTalk for Node.js
OpenJTalk.jsは、OpenJTalkのコマンドをNode.jsで扱いやすくするためのライブラリです。
<br><br>Sorry, this readme is Japanese only. Please translation with your browser or [Google Translation](https://translate.google.com/translate?sl=auto&tl=en&u=https://github.com/n-soukun/openjtalk.js).

# 動作環境
* MacOS or Linux
* Node.js

# インストール
``` shell
$ npm i openjtalk.js
```
# 使い方
## 一番シンプルな例
``` javascript
//openjtalk.jsをインポート
const openjtalk = require('openjtalk.js')
//talk関数で音声の生成と再生を実行
openjtalk.talk("こんにちは、世界！")
```
## 声をカスタマイズする場合
``` javascript
const openjtalk = require('openjtalk.js')

const text = "こんにちは、これはOpenJTalkによって生成された音声です。"

//デフォルトで搭載されているHTSボイスファイルのパスを取得
const mei_normal = getSpeaker("mei_normal")

const option = {
    speaker : mei_normal, //ここにはHTSボイスファイルのパスを指定します
    formant: 0.55,
    pitch : 0,
    speed : 1,
    intonation: 1,
}

openjtalk.talk(text, option)
    .catch(console.error)
```
## Readable型で受け取る
Discordボットで音声読み上げをしたい時などに利用できます
``` javascript
const openjtalk = require('openjtalk.js')
const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')

//ストリームの取得
const audioStream = openjtalk.stream("こんにちは、世界！")

//音声ファイルの生成
const wavPath = path.join(__dirname, "./test.wav")
const outFile = fs.createWriteStream(wavPath)
audioStream.pipe(outFile)

//音声ファイルの生成が終了したら実行
audioStream.on("close", ()=>{
    switch (process.platform) {
        case "darwin":
            playAndRefresh("afplay", wavPath)
            break
        case "linux":
            playAndRefresh("aplay", wavPath)
            break
        default:
            console.error("Playback on this OS is not supported.")
            break
    }
})

function playAndRefresh(com, path){
    execFile(com, [path],()=>{
        fs.unlinkSync(path)
    })
}
```

# v1からv2への主な変更点
多くの破壊的な変更がありますが、内部処理に関してほとんど変更はありません。そのため、既にv1を使用しているプロジェクトを無理にv2へ移行する必要はありません。
* `OpenJTalk`クラスを廃止し、代わりに関数をエクスポートする仕様になりました。
* `VoiceOption`クラスを廃止し、代わりに`OJTVoiceOption`型のオブジェクトを引数として受け取るようになりました。
* オプションの`voiceQuality`プロパティが`formant`に改名されました。
* `OJTVoiceOption`型の引数が任意になりました。これに伴い、関数`outFile`の引数の順序が変更されています。
* 関数`execute`を追加しました。`OJTOption`型の引数を渡すことで、様々な処理が可能になります。

# License
MIT License (see `LICENSE` file).