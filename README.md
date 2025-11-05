# OpenJTalk.js: A TTS module with OpenJTalk for Node.js

OpenJTalk.js は、OpenJTalk のコマンドを Node.js で扱いやすくするためのライブラリです。
<br><br>Sorry, this readme is Japanese only. Please translation with your browser or [Google Translation](https://translate.google.com/translate?sl=auto&tl=en&u=https://github.com/n-soukun/openjtalk.js#readme).

# 動作環境

## OS

-   Mac OS
-   Ubuntu 24 系
-   Windows (Shift JIS 環境のみ)

> open_jtalk のバイナリーは、Windows は Shift_JIS 版、それ以外では UTF-8 版を使用しています。

## 必須環境

-   Node.js
-   ffplay (Windows のみ talk()メソッドを使う場合に必要)

# インストール

```shell
$ npm i openjtalk.js
```

# 使い方

## 一番シンプルな例

```javascript
//openjtalk.jsをインポート
const openjtalk = require('openjtalk.js');
//talk関数で音声の生成と再生を実行
openjtalk.talk('こんにちは、世界！');
```

## 声をカスタマイズする場合

```javascript
const openjtalk = require('openjtalk.js');

const text = 'こんにちは、これはOpenJTalkによって生成された音声です。';

//デフォルトで搭載されているHTSボイスファイルのパスを取得
const mei_normal = openjtalk.getSpeaker('mei_normal');

const option = {
    speaker: mei_normal, //ここにはHTSボイスファイルのパスを指定します
    formant: 0.55,
    pitch: 0,
    speed: 1,
    intonation: 1,
};

openjtalk.talk(text, option).catch(console.error);
```

## Readable 型で受け取る

Discord ボットで音声読み上げをしたい時などに利用できます

```javascript
const openjtalk = require('openjtalk.js');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

//ストリームの取得
const audioStream = openjtalk.stream('こんにちは、世界！');

//音声ファイルの生成
const wavPath = path.join(__dirname, './test.wav');
const outFile = fs.createWriteStream(wavPath);
audioStream.pipe(outFile);

//音声ファイルの生成が終了したら実行
audioStream.on('close', () => {
    switch (process.platform) {
        case 'darwin':
            playAndRefresh('afplay', wavPath);
            break;
        case 'linux':
            playAndRefresh('aplay', wavPath);
            break;
        default:
            console.error('Playback on this OS is not supported.');
            break;
    }
});

function playAndRefresh(com, path) {
    execFile(com, [path], () => {
        fs.unlinkSync(path);
    });
}
```

# v2 から v3 への主な変更点

インストール時に open_jtalk をビルドしていましたが、リポジトリーを移してプリビルドしたものを利用するように変更しました。一部の環境（特に Ubuntu 24 系 以外の Linux ディストリビューション）では、このバイナリーが動かない可能性があります。

# License

MIT License (see `LICENSE` file).
