const code = `
import sys
import game
import asyncio

print(game.log(7))
game.jump()
await asyncio.sleep(2)
game.jump()
await game.jumpAsync()
await game.jumpAsync()
await game.jumpAsync()
game.jumpAsync()
game.jumpAsync()
`

let n = 100

let game = {
    log: function (x) {
      return x * x;
    },
    jump: ()=>{
        console.log("testing testing 123")
    },
    jumpAsync: async()=>{
        return new Promise(resolve=>{
            setTimeout(()=>{
                console.log(n)
                n++
                resolve()
            }, 2000)
        })
    }
};
  
async function start(){
    let pyodide = await loadPyodide();
    pyodide.registerJsModule("game", game);
    pyodide.runPythonAsync(code)
}

start();
