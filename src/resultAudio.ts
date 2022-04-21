import { execFile } from "child_process"
import { Stream } from "stream"
import fs from "fs"

export default class ResultAudio {
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