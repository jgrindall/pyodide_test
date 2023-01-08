const code = `
import sys
import my_js_module
import asyncio
from js import test, testAsync

print( my_js_module.sqr(7))
test()
await asyncio.sleep(2)
test()
await testAsync()
`

let my_module = {
    sqr: function (x) {
      return x * x;
    }
};
  
window.test = ()=>{
    console.log("testing testing 123")
}

window.testAsync = async()=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            console.log(100)
        }, 5000)
    })
}

async function start(){
    let pyodide = await loadPyodide();
    pyodide.registerJsModule("my_js_module", my_module);
    console.log(pyodide.runPythonAsync(code));
}

start();
