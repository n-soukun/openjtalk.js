const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const unzipper = require('unzipper');
const tar = require('tar');

/**
 * プラットフォームとアーキテクチャを取得する
 * @returns {{ platform: string, arch: string }}
 */
function getPlatformArch() {
    const platform = os.platform();
    const arch = os.arch();
    return { platform, arch };
}

/**
 * ダウンロードURLを取得する
 * @param {string} platform - プラットフォーム (win32, linux, darwin)
 * @param {string} arch - アーキテクチャ (x64)
 * @returns {string} ダウンロードURL
 */
function getDownloadUrl({ platform, arch }) {
    const version = 'v1.11-2025.11.05';
    let filename = '';
    if (platform === 'win32' && arch === 'x64') {
        filename = 'openjtalk-windows-x64.zip';
    } else if (platform === 'linux' && arch === 'x64') {
        filename = 'openjtalk-linux-x64.tar.gz';
    } else if (platform === 'darwin' && arch === 'x64') {
        filename = 'openjtalk-macos-x64.tar.gz';
    } else {
        throw new Error('Unsupported platform or architecture');
    }
    return `https://github.com/n-soukun/openjtalk.exe/releases/download/${version}/${filename}`;
}

/**
 * ファイルをダウンロド
 * @param {string} url ダウンロード元のURL
 * @param {stirng} dest  ダウンロード先のパス
 * @returns {Promise<void>}
 */
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
                                new Error('Redirect with no location header'),
                            );
                        }
                        // Follow redirect
                        doRequest(redirectUrl, redirectCount + 1);
                    } else if (response.statusCode !== 200) {
                        return reject(
                            new Error(
                                `Failed to get '${currentUrl}' (${response.statusCode})`,
                            ),
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

/**
 * ファイルを解凍する
 * @param {string} filePath
 * @param {string} extractTo
 * @returns {Promise<void>}
 */
function extractFile(filePath, extractTo) {
    if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
    }
    const ext = path.extname(filePath);
    if (ext === '.zip') {
        return fs
            .createReadStream(filePath)
            .pipe(unzipper.Extract({ path: extractTo }))
            .promise();
    } else if (ext === '.gz') {
        return tar.x({
            file: filePath,
            cwd: extractTo,
        });
    } else {
        throw new Error(`Unsupported file extension: ${ext}`);
    }
}

/**
 * binディレクトリにコピー
 * @param {string} srcDir
 * @param {string} binDir
 * @return {void}
 */
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
        const fileName = path.basename(new URL(url).pathname);
        const zipPath = path.join(__dirname, fileName);
        const binDir = path.join(__dirname, 'bin');
        const extractDir = path.join(__dirname, 'extracted');

        console.log(`Downloading from ${url}...`);
        await downloadFile(url, zipPath);

        console.log('Extracting...');
        await extractFile(zipPath, extractDir);

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
