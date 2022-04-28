import fs from "fs"
import { Command } from "./command"

export class ResultAudio {
    constructor(
        public wavFilePath: string
    ){}
	get(): fs.ReadStream{
		return fs.createReadStream(this.wavFilePath)
	}
	play(): Promise<void>{
		return new Promise((resolve, reject)=>{
			const command = getPlayCommand()
			if(command){
				command.setValue(this.wavFilePath)
				command.exec()
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