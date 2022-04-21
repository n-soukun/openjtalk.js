import { Stream } from "stream"
import fs from "fs"
import Command from "./command"

export default class ResultAudio {
    constructor(
        public wavFilePath: string
    ){}
	get(): Stream{
		return fs.createReadStream(this.wavFilePath)
	}
	play(): Promise<void>{
		return new Promise((resolve, reject)=>{
			const command = getPlayCommand()
			if(command){
				command.setValue(this.wavFilePath)
				command.execute()
				.then(()=>resolve())
				.catch(reject)
			}else{
				return reject("Playback on this OS is not supported.")
			}
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