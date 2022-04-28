import fs from 'fs'
import path from 'path'
const uuid = require('uuid-v4')
import {VoiceOption, OpenJTalkArgument } from "./voiceOption"
import { Command, execCommands } from './command'
import { ResultAudio } from "./resultAudio"
import type { Readable } from 'stream'

export function runOpenJTalk (str: string, option: VoiceOption | OpenJTalkArgument): Promise<ResultAudio>{
	return new Promise((resolve, reject)=>{
		const mes = [
            '',
            '-------------------------------------------------------------------------',
            '[!] This is not an error.',
            '-------------------------------------------------------------------------',
            '    The function "runOpenJTalk" has been deprecated since version 1.1.0.',
            '    Please use the OpenJTalk class instead.',
            '-------------------------------------------------------------------------',
            ''
        ]
        console.log(mes.join('\n'))
        try {
            const tempDirPath = path.join(__dirname, '../temp/')
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirSync(tempDirPath)
            }
	
            const command = new Command('open_jtalk')
			const options = ((option: VoiceOption | OpenJTalkArgument): OpenJTalkArgument => {
                if(option instanceof VoiceOption) return option.values
                return option
            })(option)
            
            const wavFileName = ((ow?: string)=>{
                if(ow) return ow
                return path.join(__dirname, '../temp/' + uuid() + '.wav')
            })(options.ow)
            const txtFileName = path.join(__dirname, '../temp/' + uuid() + '.txt')

            command.setArg('a',options.a)
            command.setArg('b',options.b)
            command.setArg('fm',options.fm)
            command.setArg('jf',options.jf)
            command.setArg('jm',options.jm)
            command.setArg('m',options.m)
            command.setArg('ot',options.ot)
            command.setArg('ow',wavFileName)
            command.setArg('p',options.p)
            command.setArg('r',options.r)
            command.setArg('s',options.s)
            command.setArg('u',options.u)
            command.setArg('x',options.x)
            command.setArg('z',options.z)
			command.setValue(txtFileName)
	
			fs.writeFileSync(txtFileName, str)

            command.exec()
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

export class OpenJTalk {
    constructor(
        public com?: string
    ){}
    stream(str: string, config: VoiceOption | OpenJTalkArgument): Readable{
        const comName = this.com ? this.com : "open_jtalk"
        const commands = getCommands(str, comName, config)
        const result = execCommands(commands)
        return result.stdout
    }
    outFile(str: string, config: VoiceOption | OpenJTalkArgument, wavPath: string): Promise<void>{
        return new Promise((resolve, reject)=>{
            try {
                const stream = this.stream(str, config)
                const wav = fs.createWriteStream(wavPath)
                stream.pipe(wav)
                wav.on('finish',()=>{
                    resolve()
                })   
            } catch (error) {
                reject(error)
            }
        }) 
    }
    talk(str: string, config: VoiceOption | OpenJTalkArgument): Promise<void>{
        return new Promise((resolve, reject)=>{
            const play = getPlayCommand()
            if(!play){
                return reject("Playback on this OS is not supported.")
            }
            const wavPath = path.join(__dirname, '../temp/' + uuid() + '.wav')
            this.outFile(str, config, wavPath)
            .then(()=>{
                play.setValue(wavPath)
                return play.exec()
            })
            .then(()=>{
                resolve()
                fs.unlinkSync(wavPath)
            })
            .catch(reject)
        })
    }
}

function getCommands(str:string, comName: string, config: VoiceOption | OpenJTalkArgument): Command[]{
    const echo = new Command("echo")
    echo.setValue(str)
    const options: OpenJTalkArgument = (()=>{
        if(config instanceof VoiceOption) return config.values
        return config
    })()
    const ojt = new Command(comName)
    ojt.setArg('a',options.a)
    ojt.setArg('b',options.b)
    ojt.setArg('fm',options.fm)
    ojt.setArg('jf',options.jf)
    ojt.setArg('jm',options.jm)
    ojt.setArg('m',options.m)
    ojt.setArg('ot',options.ot)
    ojt.setArg('ow',"/dev/stdout")
    ojt.setArg('p',options.p)
    ojt.setArg('r',options.r)
    ojt.setArg('s',options.s)
    ojt.setArg('u',options.u)
    ojt.setArg('x',options.x)
    ojt.setArg('z',options.z)
    return [echo, ojt]
}

function getPlayCommand(): Command | null{
	switch (process.platform) {
		case "darwin":
			return new Command('afplay')
		case "linux":
			return new Command('aplay')
		default:
			return null
	}
}