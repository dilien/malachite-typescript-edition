import { Vector } from "../shared/utils";
import { Weapon } from "../shared/weapon";
import { Player } from "./shared+/player";
import { camPos, canvas, plr } from "./variables";

export let mousePos = new Vector(0, 0);

export let mouseDown = false;
canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

onmousemove = function(e){
    if (document.pointerLockElement === canvas) {
        mousePos = mousePos.add(new Vector(e.movementX, e.movementY))
    }
    if(plr){
        plr.lookAt(camPos.add(mousePos))
    }
}

onmousedown = function(e){
    mouseDown = true
}
onmouseup = function(e){
    mouseDown = false
}

const keys:string[] = []
document.onkeyup = function keypress(e) {
    if (keys.indexOf(e.key) != -1) {
        keys.splice(keys.indexOf(e.key), 1);
    }
    if(plr && e.key == "f"){
        plr.flashlight = !plr.flashlight
    }
}
document.onkeydown = function keypress(e) {
    if (keys.indexOf(e.key) == -1) {
        keys.push(e.key);
    }
    const num = Number(e.key)
    if(plr && num){
        if(num > 0 && num <= plr.weapons.length){
            plr.weapon = plr.weapons[num - 1]
            //also send network packet.
        }
    }
}

const speed = 250;

export function movement(){
    if(!plr){return;}
    if(mouseDown){
        console.log("fire A");
        console.log(plr.weapon);
        plr.weapon.fire();
    }
    const delta = 0.016
    var x = 0
    var y = 0
    if(keys.indexOf("w") > -1){
        y -= delta * speed
    }
    if(keys.indexOf("a") > -1){
        x -= delta * speed
    }
    if(keys.indexOf("s") > -1){
        y += delta * speed
    }
    if(keys.indexOf("d") > -1){
        x += delta * speed
    }
    plr.move(new Vector(x, y))
}

export function recoil(plr:Player, weapon:Weapon){
    const diff = mousePos.sub(new Vector(400, 400))
    let distance = diff.dist()
    let newRotation = plr.rotation + (-0.1 + 0.2 * Math.round(Math.random())) * weapon.data.v.recoil
                
    distance += (-20 + 40 * Math.round(Math.random())) * weapon.data.v.recoil
    const x = 400 + Math.cos(newRotation) * distance
    const y = 400 + Math.sin(newRotation) * distance
    mousePos = new Vector(x, y);
    plr.lookAt(mousePos.add(camPos))
}