const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const unzipper = require('unzipper');

// 判定用関数
function getPlatformArch() {
    const platform = os.platform();
    const arch = os.arch();
    // 必要に応じてマッピング
    return { platform, arch };
}

// Github ReleaseのURLを組み立てる
function getDownloadUrl({ platform, arch }) {
    const version = 'v1.11-2025.11.05';
    let filename = '';
    if (platform === 'win32' && arch === 'x64') {
        filename = 'openjtalk-windows-x64.zip';
    } else if (platform === 'linux' && arch === 'x64') {
        filename = 'openjtalk-linux-x64.zip';
    } else if (platform === 'darwin' && arch === 'x64') {
        filename = 'openjtalk-macos-x64.zip';
    } else {
        throw new Error('Unsupported platform or architecture');
    }
    return `https://github.com/n-soukun/openjtalk.exe/releases/download/${version}/${filename}`;
}

// ファイルをダウンロード
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        function doRequest(currentUrl, redirectCount = 0) {
            if (redirectCount > 5) {
                return reject(new Error('Too many redirects'));
            }
            https
                .get(currentUrl, (response) => {
                    if (
                        response.statusCode === 302 ||
                        response.statusCode === 301
                    ) {
                        const redirectUrl = response.headers.location;
                        if (!redirectUrl) {
                            return reject(
                                new Error('Redirect with no location header')
                            );
                        }
                        // Follow redirect
                        doRequest(redirectUrl, redirectCount + 1);
                    } else if (response.statusCode !== 200) {
                        return reject(
                            new Error(
                                `Failed to get '${currentUrl}' (${response.statusCode})`
                            )
                        );
                    } else {
                        response.pipe(file);
                        file.on('finish', () => file.close(resolve));
                    }
                })
                .on('error', (err) => {
                    fs.unlink(dest, () => reject(err));
                });
        }

        doRequest(url);
    });
}

// Zipを展開
function extractZip(zipPath, extractTo) {
    return fs
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractTo }))
        .promise();
}

// binフォルダーにコピー
function copyToBin(srcDir, binDir) {
    if (!fs.existsSync(binDir)) fs.mkdirSync(binDir);
    fs.readdirSync(srcDir).forEach((file) => {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(binDir, file);
        fs.copyFileSync(srcFile, destFile);
    });
}

// メイン処理
(async () => {
    try {
        const { platform, arch } = getPlatformArch();
        const url = getDownloadUrl({ platform, arch });
        const zipPath = path.join(__dirname, 'download.zip');
        const extractDir = path.join(__dirname, 'extracted');
        const binDir = path.join(__dirname, 'bin');

        console.log(`Downloading from ${url}...`);
        await downloadFile(url, zipPath);

        console.log('Extracting zip...');
        await extractZip(zipPath, extractDir);

        console.log('Copying to bin...');
        copyToBin(extractDir, binDir);

        // 後始末
        fs.unlinkSync(zipPath);
        fs.rmSync(extractDir, { recursive: true, force: true });

        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
