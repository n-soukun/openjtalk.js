import { Stream } from "stream"
import { OpenJTalkArgument } from "./base"
import VoiceOption from "./voiceOption"
import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
const uuid = require('uuid-v4')

export default function runOpenJTalk (str: string, option: VoiceOption): Promise<ResultAudio>{
	return new Promise((resolve, reject)=>{
		try {
            const tempDirPath = path.join(__dirname, '../temp/')
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirSync(tempDirPath)
            }

			const wavFileName = path.join(__dirname, '../temp/' + uuid() + '.wav')
			const txtFileName = path.join(__dirname, '../temp/' + uuid() + '.txt')
	
            const command = new Command('open_jtalk')
			const options: OpenJTalkArgument = option.values
			options.ow = wavFileName

            command.setArg('a',options.a)
            command.setArg('b',options.b)
            command.setArg('fm',options.fm)
            command.setArg('jf',options.jf)
            command.setArg('jm',options.jm)
            command.setArg('m',options.m)
            command.setArg('ot',options.ot)
            command.setArg('ow',options.ow)
            command.setArg('p',options.p)
            command.setArg('r',options.r)
            command.setArg('s',options.s)
            command.setArg('u',options.u)
            command.setArg('x',options.x)
            command.setArg('z',options.z)
			command.setValue(txtFileName)
	
			fs.writeFileSync(txtFileName, str)

            command.execute()
            .then(()=>{
				resolve(new ResultAudio(wavFileName))
				fs.unlinkSync(txtFileName)
            })
            .catch(reject)

		} catch (error) {
			reject(error)
		}
	})
}

class Command {
    constructor(
        public name: string,
        private args?: {[key: string]: string;},
        private value?: string 
    ){}
    setArg(key: string, value: any): boolean {
        if(!this.args) this.args = {}
        if(value){
            this.args[key] = String(value)
            return true
        }
        return false
    }
    setValue(value: string){
        this.value = String(value)
    }
    execute(){
        return new Promise((resolve,reject)=>{
            execFile(this.name, this.getArgs(), {}, (err: Error | null, stdout: string | Buffer, stderr: string | Buffer)=>{
                if(err) return reject()
                resolve({
                    stdout : stdout,
                    stderr : stderr
                })
            })
        })
    }
    private getArgs(): string[]{
        let result: Array<string> = []
        if(this.args) {
            Object.keys(this.args).forEach(key=>{
                result.push(key)
                result.push(this.args![key])
            })
        }
        if(this.value) {
            result.push(this.value)
        }
        return result
    }
}

class ResultAudio {
    constructor(
        public wavFilePath: string
    ){}
	get(): Stream{
		return fs.createReadStream(this.wavFilePath)
	}
	play(): Promise<void>{
		return new Promise((resolve, reject)=>{
			execFile('afplay', [this.wavFilePath], {} ,(err: Error | null)=>{
				if(err) return reject()
				resolve()
			})
		})
	}
    close(): Promise<void>{
        return new Promise((resolve, reject) => {
            fs.unlink(this.wavFilePath,(err: Error | null)=>{
				if(err) return reject()
				resolve()
			})
        })
    }
}