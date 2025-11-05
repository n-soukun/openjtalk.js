const openjtalk = require('../dist/index');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');

//生成する音声の原稿
const text = 'こんにちは、これはOpenJTalkによって生成された音声です。';

//HTSボイスファイルのパスを取得
const mei_normal = openjtalk.getSpeaker('mei_normal');

//生成する音声の設定
const option = {
    speaker: mei_normal, // 話者(m) ※HTSボイスファイルへのパスを指定してください
    formant: 0.55, // 声質(a)
    pitch: 0, // ピッチシフト(fm)
    speed: 1, // 話速(r)
    intonation: 1, // 抑揚(jf)
};

//ストリームの取得
const audioStream = openjtalk.stream(text, option);

//音声ファイルの生成
const wavPath = path.join(__dirname, './test.wav');
const outFile = fs.createWriteStream(wavPath);
audioStream.pipe(outFile);

//音声ファイルの生成が終了すると実行
audioStream.on('close', () => {
    switch (process.platform) {
        case 'darwin':
            playAndRefresh('afplay', wavPath);
            break;
        case 'linux':
            playAndRefresh('aplay', wavPath);
            break;
        default:
            playAndRefresh('ffplay', wavPath);
            break;
    }
});

//コマンドの実行とファイルの削除
function playAndRefresh(com, path) {
    execFile(com, [path], () => {
        fs.unlinkSync(path);
    });
}
