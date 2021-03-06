import path from "path"
import fs from "fs"

export interface OpenJTalkArgument {
    x : string
    m : string
    ow? : string
    ot? : string
    s? : number
    p? : number
    a? : number
    b? : number
    r? : number
    fm? : number
    u? : number
    jm? : number
    jf? : number
    z? : number
}

interface VoiceOptionData {
    speaker : string
    pitch? : number
    speed? : number
    voiceQuality?: number
    intonation?: number
}

export class VoiceOption {
    values : Omit<OpenJTalkArgument,'ow'>
	constructor(data: VoiceOptionData, option?: Omit<OpenJTalkArgument, 'x'|'m'|'ow'|'fm'|'r'|'jf'>){
		const config = this._getConfigJson()
        this.values = {
            m  : path.join(__dirname, '../voice/' + config.speaker[data.speaker] + '.htsvoice'),
            x  : path.join(__dirname, '../dic/' + config.dictionary),
            s  : option?.s,
            p  : option?.p,
            a  : data.voiceQuality,
            b  : option?.b,
            r  : data.speed,
            fm : data.pitch,
            u  : option?.u,
            jm : option?.jm,
            jf : data.intonation,
            z  : option?.z
        }
	}
	setVoice(speaker: string){
		const config = this._getConfigJson()
		this.values.m = path.join(__dirname, '../voice/' + config.speaker[speaker] + '.htsvoice')
	}
	_getConfigJson(){
		const configPath = path.join(__dirname, '../openjtalk.json')
		return JSON.parse(fs.readFileSync(configPath, 'utf8'));
	}
}