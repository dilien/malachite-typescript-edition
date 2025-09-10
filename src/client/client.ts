
import{mulch} from "../shared/shared";
import { Vector } from "../shared/utils";
import { mousePos, movement } from "./controls";
import { renderGUI } from "./gui";
import { createLighting, finalFill, generatePlayerLighting, spotLight } from "./lighting";
import { players } from "./networking";
import { plr, camPos, ctx, SetCamPos } from "./variables";
import {} from "./networking";


// export let plr:(Player|null) = null;
// export const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
// //I mulching hate typescript why do I have to do this
// export const ctx = canvas.getContext("2D") as unknown as CanvasRenderingContext2D;
// export var camPos:Vector = new Vector(0, 0);
// export const screenSize = new Vector(800, 800)

const target_url = "ws://" + window.location.hostname + ":5001";
var is_enemy = false;
export var sock = new WebSocket(target_url);

sock.onopen = function (event) { 
    console.log('Connection opened') 
     
    sock.send(JSON.parse(String(mulch(2))));
};
sock.onclose = function (event) { console.log('Connection closed') };
sock.onerror = function (event) { console.log(event) };
sock.onmessage = async function (event) {
    const text = await new Response(event.data).text()
    const data = JSON.parse(text);
    console.log(data);
}

//the full render loop
async function render(){
    //wait until assigned from server
    if(plr == null){return;}
    const delta = 0.016;
    movement()
    SetCamPos(plr.pos.sub(new Vector(400, 400)));

    for(const id in players){
        players[id].step(delta)
    }

    //@ts-ignore
    ctx.reset()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 1000, 1000);

    var lights = []
    lights.push(await createLighting(new Vector(0, 0), spotLight))

    for(const id in players){
        const player = players[id];
        lights.push(await generatePlayerLighting(player));
    }

    //@ts-ignore
    ctx.reset()
    ctx.fillStyle = "rgb(0 0 0)"
    ctx.fillRect(0, 0, 800, 800)
    ctx.globalCompositeOperation = "lighter"

    for(const id in lights){
        const light = lights[id];
        if(light){
            ctx.drawImage(light[0], light[1].x, light[1].y)
        }
    }

    const finalLight = ctx.getImageData(0, 0, 800, 800)

    //@ts-ignore
    ctx.reset()
    mainRender()

    ctx.globalCompositeOperation = "multiply"
    var bitmap = await createImageBitmap(finalLight)
    ctx.drawImage(bitmap, 0, 0)



    ctx.globalCompositeOperation = "source-over";

    //for(const id in tracers){
    //    tracers[id].update(0.016)
    //}

    finalFill(camPos.add(new Vector(400, 400)))
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
    ctx.fill();

    renderGUI();
    requestAnimationFrame(render)
}

function mainRender(){
    for(const id in players){
        players[id].render()
    }
    //render floors and other stuff
}

requestAnimationFrame(render)