const openjtalk = require('../dist/index');
const fs = require('fs');
const path = require('path');

//生成する音声の原稿
const text = 'こんにちは';

//HTSボイスファイルのパスを取得
const mei_normal = openjtalk.getSpeaker('mei_normal');

//生成する音声の設定
const option = {
    speaker: mei_normal, // 話者(m) ※HTSボイスファイルへのパスを指定してください
    volume: 0.1,
};

//音声ファイルの生成
const stream = openjtalk.stream(text, option);

//生成した音声ファイルを保存
const outPath = path.join(__dirname, 'output.wav');
const writeStream = fs.createWriteStream(outPath);
stream.pipe(writeStream);
writeStream.on('finish', () => {
    console.log('音声ファイルが生成されました:', outPath);
});
writeStream.on('error', (err) => {
    console.error('音声ファイルの生成中にエラーが発生しました:', err);
});
