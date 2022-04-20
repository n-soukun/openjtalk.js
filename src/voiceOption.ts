import path from "path"
import fs from "fs"
import { OpenJTalkArgument } from "./base"

interface VoiceOptionData {
    voice : string
    pitch? : number
    speed? : number
}

export default class VoiceOption {
    values : Omit<OpenJTalkArgument,'ow'>
	constructor(data: VoiceOptionData, option?: Omit<OpenJTalkArgument, 'x'|'m'|'ow'|'p'|'r'>){
		const config = this._getConfigJson()
        this.values = {
            m  : path.join(__dirname, '../voice/' + config.voice[data.voice] + '.htsvoice'),
            x  : path.join(__dirname, '../dic/' + config.dictionary),
            s  : option?.s,
            p  : data.pitch,
            a  : option?.a,
            b  : option?.b,
            r  : data.speed,
            fm : option?.fm,
            u  : option?.u,
            jm : option?.jm,
            jf : option?.jf,
            z  : option?.z
        }
	}
	setVoice(voiceName: string){
		const config = this._getConfigJson()
		this.values.m = path.join(__dirname, '../voice/' + config.voice[voiceName] + '.htsvoice')
	}
	_getConfigJson(){
		const configPath = path.join(__dirname, '../config.json')
		return JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}
}