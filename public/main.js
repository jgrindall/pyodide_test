const code = `

import sys
import game
import asyncio
import trace
import inspect
import warnings
import os
import traceback

#sys.stdout = game.getLoggerOut()
errorLogger = game.getLoggerError()

class StdError():
    def write(self, txt):
        print("txt", txt)
        #eg. txt <exec>:43: RuntimeWarning: coroutine 'Block.move' was never awaited
        stack = traceback.extract_stack()
        line_no = -1
        for frame in stack:
            print(frame)
            if frame.name == "main" and frame.filename == "<exec>":
                print("missing await on line", frame.lineno)
                line_no = frame.lineno
        errorLogger.write("ERROR " + line_no)


sys.stderr = StdError()

class Block:

    def __init__(self, n):
        self.n = n

    async def move(self):        
        block = game.getBlock(0) 
        await block.move()


block0 = Block(0)

async def main():
    block0.move()   

await main()

`

let n = 100

let game = {
    log: function (x) {
      return x * x;
    },
    getLoggerOut: ()=> {
        return {
            write: (...args) => {
                console.log("out", args)
            }
        }
    },
    getLoggerError: ()=> {
        return {
            write: (...args) => {
                console.log("error", args)
            }
        }
    },
    getBlock:(i)=>{
        console.log("get block", i);
        return {
            setx:function(){

            },
            move: function(){
                console.log("move");
                return new Promise(resolve=>{
                    console.log("MOVE", i)
                    setTimeout(()=>{
                        resolve()
                    }, 1000)        
                })
            }
        };
    },
    jump: ()=>{
        console.log("jump")
    },
    jumpAsync: async()=>{
        console.log("jump async")
        return new Promise(resolve=>{
            setTimeout(()=>{
                console.log(n)
                n++
                resolve()
            }, 1000)
        })
    }
};
  
async function start(){
    let pyodide = await loadPyodide();
    pyodide.registerJsModule("game", game);
    console.log("run")
    pyodide.runPythonAsync(code)
}

start();
