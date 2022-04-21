import { execFile } from "child_process";

export default class Command {
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
    execute(): Promise<{stdout: string | Buffer,stderr: string | Buffer}>{
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
    private getArgs(): string[]{
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