import fs from 'fs'
import path from 'path'
const uuid = require('uuid-v4')
import VoiceOption, { OpenJTalkArgument } from "./voiceOption"
import Command from './command'
import ResultAudio from "./resultAudio"

export default function runOpenJTalk (str: string, option: VoiceOption | OpenJTalkArgument): Promise<ResultAudio>{
	return new Promise((resolve, reject)=>{
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