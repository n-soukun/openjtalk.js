import path from "path"
import fs from "fs"
import { Command, execCommands } from "./command"
import { Readable } from "stream"
const uuid = require('uuid-v4')

const OPENJTALK_PATH = path.join(__dirname, "../bin/open_jtalk")

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../openjtalk.json'), 'utf8'))

export const DEFAULT_DICTIONARY_PATH = path.join(__dirname, '../dic/', config.dictionary)
export const DEFAULT_SPEAKER_PATH = path.join(__dirname, '../voice/', config.speaker.mei_normal)

export interface OJTVoiceOption {
    speaker?: string      // -m
    samplingRate?: number // -s
    framePeriod?: number  // -p
    formant?: number      // -a
    postFilter?: number   // -b
    speed?: number        // -r
    pitch?: number        // -fm
    uvThreshold?: number    // -u
    spectrum?: number     // -jm
    intonation?: number   // -jf
    volume?: number       // -g
    bufferSize?: number   // -z
}

export interface OJTOutputOption {
    path?: string,        // -ow
    log?: string          // -ot
}

export interface OJTOption {
    dictionary?: string    // -x
    voice?: OJTVoiceOption,
    output?: OJTOutputOption
}

export interface OJTArgument {
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
    g? : number
    z? : number
}

function createOJTArgs(option: OJTOption):  OJTArgument{
    return {
         x: option.dictionary || DEFAULT_DICTIONARY_PATH,
         m: option.voice?.speaker || DEFAULT_SPEAKER_PATH,
        ow: option.output?.path,
        ot: option.output?.log,
         s: option.voice?.samplingRate,
         p: option.voice?.framePeriod,
         a: option.voice?.formant,
         b: option.voice?.postFilter,
         r: option.voice?.speed,
        fm: option.voice?.pitch,
         u: option.voice?.uvThreshold,
        jm: option.voice?.spectrum,
        jf: option.voice?.intonation,
         g: option.voice?.volume,
         z: option.voice?.bufferSize
    }
}

function getOJTCommands(str:string, args: OJTArgument): Command[]{
    const echo = new Command("echo")
    echo.setValue(str)
    const ojt = new Command(OPENJTALK_PATH)
    ojt.setArg('m', args.m)
    ojt.setArg('x', args.x)
    ojt.setArg('ow', args.ow)
    ojt.setArg('ot', args.ot)
    ojt.setArg('s', args.s)
    ojt.setArg('p', args.p)
    ojt.setArg('a', args.a)
    ojt.setArg('b', args.b)
    ojt.setArg('r', args.r)
    ojt.setArg('fm', args.fm)
    ojt.setArg('u', args.u)
    ojt.setArg('jm', args.jm)
    ojt.setArg('jf', args.jf)
    ojt.setArg('g', args.g)
    ojt.setArg('z', args.z)
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

export function getSpeaker(name: string): string | undefined{
    if(!config.speaker[name]) return undefined
    return path.join(__dirname, '../voice/' + config.speaker[name] + '.htsvoice')
}

export async function outFile(text: string, wavPath: string, voiceOption?: OJTVoiceOption,): Promise<void>{
    const option: OJTOption = {
        voice: voiceOption,
        output: {path: wavPath}
    }
    const commands = getOJTCommands(text, createOJTArgs(option))
    const result = execCommands(commands)
    await new Promise<void>((resolve,_)=>result.stdout.on('close', ()=>resolve()))
}

export function stream(text: string, voiceOption?: OJTVoiceOption): Readable{
    const commands = getOJTCommands(text, createOJTArgs({voice: voiceOption}))
    const result = execCommands(commands)
    return result.stdout
}

export async function talk(text: string, voiceOption?: OJTVoiceOption): Promise<void>{
    const play = getPlayCommand()
    if(!play) throw new Error("Playback on this OS is not supported.").stack

    const tempDir = path.join(__dirname, '../temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const wavPath = path.join(__dirname, '../temp/' + uuid() + '.wav')
    await outFile(text, wavPath, voiceOption)
    play.setValue(wavPath)
    await play.exec()
    fs.unlink(wavPath, ()=>{})
}