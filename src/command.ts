import { ChildProcessWithoutNullStreams, execFile, spawn } from "child_process";
import { Readable } from "stream";

export class Command {
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
    setValue(value: string): void{
        this.value = String(value)
    }
    exec(): Promise<{stdout: string | Buffer,stderr: string | Buffer}>{
        return new Promise((resolve,reject)=>{
            execFile(this.name, this.getArgs(), {}, (err: Error | null, stdout: string | Buffer, stderr: string | Buffer)=>{
                if(err) return reject(err)
                resolve({
                    stdout : stdout,
                    stderr : stderr
                })
            })
        })
    }
    getArgs(): string[]{
        let result: Array<string> = []
        if(this.args) {
            Object.keys(this.args).forEach(key=>{
                result.push('-'+key)
                result.push(this.args![key])
            })
        }
        if(this.value) {
            result.push(this.value)
        }
        return result
    }
}

export interface CommandsResult {
    stdout: Readable
    stderr: Readable
}

export function execCommands(commands: Command[]): CommandsResult{
    const stderr = new Readable()
    let processes:ChildProcessWithoutNullStreams[] = []
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        processes[i] = spawn(command.name, command.getArgs())
    }
    for (let i = 0; i < commands.length; i++) {
        if(i+1 < commands.length){
            processes[i].stdout.pipe(processes[i+1].stdin)
        }
    }
    for (let i = 0; i < commands.length; i++) {
        processes[i].stderr.on('data', (data) => {
            stderr.push(data)
            console.error(Buffer.from(data, "binary").toString())
        })
    }
    processes[commands.length - 1].stdout.on("close",()=>{
        stderr.push(null)
    })
    return {
        stdout: processes[commands.length - 1].stdout,
        stderr: stderr
    }
}