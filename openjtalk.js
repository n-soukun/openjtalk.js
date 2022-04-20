const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid-v4')

exports.VoiceOption = class VoiceOption {
	constructor(data, option){
		const config = this._getConfigJson()
		const options = {
			m  : path.join(__dirname, 'voice/' + config.voice[data.voice] + '.htsvoice'),
			x  : path.join(__dirname, 'dic/' + config.dictionary),
			p  : data.pitch,
			r  : data.speed,
		}
		if(option) Object.keys(data).forEach((key) => options[key] = option[key])
		Object.keys(options).forEach((key) => this[key] = options[key])
	}
	setVoice(voiceName){
		const config = this._getConfigJson()
		this.m = path.join(__dirname, 'voice/' + config.voice[voiceName] + '.htsvoice')
	}
	_getConfigJson(){
		const configPath = path.join(__dirname, 'config.json')
		return JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}
}

/**
 * OpenJTalkで音声合成を実行する
 * @param {string} str 生成する音声の原稿
 * @param {object} option 生成する音声の設定
 * @returns {Promise<ResultAudio>} 生成結果
 */
exports.execute = function execute (str, option){
	return new Promise((resolve, reject)=>{
		try {
			const wavFileName = path.join(__dirname, 'temp/' + uuid() + '.wav')
			const txtFileName = path.join(__dirname, 'temp/' + uuid() + '.txt')
	
			let ojtCmd = ['open_jtalk']
			const options = option
			options.ow = wavFileName
	
			for (let option in options) {
				const value = options[option]
				if (value) {
					ojtCmd.push('-'+option)
					ojtCmd.push(value)
				}
			}
	
			ojtCmd.push(txtFileName)
	
			fs.writeFileSync(txtFileName, str)
	
			execFile(ojtCmd[0], ojtCmd.slice(1),(err, stdout, stderr)=>{
				if(err) return reject(err)
				resolve(new ResultAudio(wavFileName))
				fs.unlinkSync(txtFileName)
			})
		} catch (error) {
			reject(error)
		}
	})
}

class ResultAudio {
    constructor(path){
        this.wavFilePath = path
    }
	get(){
		return fs.createReadStream(this.wavFilePath)
	}
	play(){
		return new Promise((resolve, reject)=>{
			execFile('afplay', [this.wavFilePath], (err)=>{
				if(err) return reject()
				resolve()
			})
		})
	}
    close(){
        return new Promise((resolve, reject) => {
            fs.unlink(this.wavFilePath,(err)=>{
				if(err) return reject()
				resolve()
			})
        })
    }
}