import { Player } from "./player";
import { Vector, castRayBox } from "./utils";


interface VisualData{
    flashTime:number,
    flashEffect:number,
    recoil:number,
    uiCoord: [number, number, number, number],
    ammoCoord: [number, number, number, number],
}

interface WeaponClass{
    reload:number,
    cooldown:number,
    ammo:number,
    auto:boolean,
    singleReload:boolean,
    spread:number,//only assign if there is pellets, this is a non random spread
    pellets:number,
    v:VisualData
}

enum WeaponAction{
    draw,
    reload,
    fire,
}

export class Weapon{
    data:WeaponClass;
    owner:Player;

    delta:number;
    action:WeaponAction;

    ammo:number;

    constructor(data:WeaponClass, plr:Player){
        this.data = data
        this.owner = plr
        this.delta = 0
        this.ammo = data.ammo;
        this.action = WeaponAction.fire;
    }
    fire(){
        if(this.delta > 0){return;}
        this.delta = this.data.cooldown;
        this.ammo -= 1;

        //tracer
        const rotation = this.owner.rotation
        const forward = new Vector(Math.cos(rotation), Math.sin(rotation));
        const start = this.owner.pos.add(forward.mult(35));
        if(this.data.pellets > 1){
            var angle = this.data.spread;
            for(let i=0; i<5; i++){
                const forward2 = forward.rotate(angle);
                angle -= (this.data.spread * 2) / this.data.pellets;
                const [end, _] = castRayBox(start, forward2);
                //tracers.push(new Tracer(0.1, start, end));
            }
        }else{
            const [end, _] = castRayBox(start, forward);
            //tracers.push(new Tracer(0.1, start, end));
        }


        // if(this.owner == plr){
        //     const data:FireEvent = {type:"fire", name:plr.name}
        //     sock.send(JSON.stringify(data))

        //     //recoil
        //     const diff_x = mouseX - 400
        //     const diff_y = mouseY - 400
        //     let distance = Math.sqrt(diff_x ** 2 + diff_y ** 2)
        //     let newRotation = plr.rotation + (-0.1 + 0.2 * Math.round(Math.random())) * this.data.recoil
            
        //     distance += (-20 + 40 * Math.round(Math.random())) * this.data.recoil
        //     mouseX = 400 + Math.cos(newRotation) * distance
        //     mouseY = 400 + Math.sin(newRotation) * distance
        //     plr.lookAt(mouseX + camX, mouseY + camY)
        // }
    }
    step(delta:number){
        this.delta -= delta;
        // if(mouseDown && plr.weapon.data.auto){
        //     plr.weapon.fire();
        // }
    }
}

//sample data
let smg:WeaponClass = {
    reload:2,
    cooldown:0.1,
    v:{
        recoil:0.5,
        flashTime:0.1,
        flashEffect:1,
        uiCoord: [124, 68, 118, 48],
        ammoCoord: [65, 45, 10, 25], 
    },
    ammo:22,
    auto:true,
    singleReload:false,
    spread:1,
    pellets:5,
}
let shotgun:WeaponClass = {
    reload:2,
    cooldown:0.5,
    v:{
        recoil:5,
        flashTime:0.2,
        flashEffect:5,
        uiCoord: [124, 16, 118, 48],
        ammoCoord: [79, 34, 16, 36],
    },
    ammo:6,
    auto:false,
    singleReload:true,
    spread:0.2,//only assign if there is pellets, this is a non random spread
    pellets:5,
}

export const weapons = {"smg":smg, "shotgun":shotgun}

const tracers = []

// class Effect{
//     constructor(time){
//         this.delta = time
//     }
//     update(delta){
//         this.delta -= delta
//         if(this.delta < 0){
//             delete this;
//             return;
//         }
//         this.effect()
//     }
//     effect(){
//         //empty
//     }
// }

// class Tracer extends Effect{
//     constructor(time, startPoint, endPoint){
//         super(time)
//         this.startPoint = startPoint
//         this.endPoint = endPoint
//         //we actually want a gradient perpendicular to the line
//     }
//     effect(){
//         const diff = this.endPoint.sub(this.startPoint).normal().mult(this.delta * 50);
//         const rotatedDiff = diff.rotate(0.5 * Math.PI);
//         const pointA = this.startPoint.add(rotatedDiff);
//         const pointB = this.startPoint.add(rotatedDiff.mult(-1));
//         const gradient = ctx.createLinearGradient(pointA.x - camX, pointA.y - camY, pointB.x - camX, pointB.y - camY);
//         gradient.addColorStop(0, "transparent");
//         gradient.addColorStop(0.5, "yellow");
//         gradient.addColorStop(1, "transparent");
//         ctx.strokeStyle = gradient;
//         ctx.lineWidth = 15
//         ctx.beginPath()
//         ctx.moveTo(this.startPoint.x - camX, this.startPoint.y - camY)
//         ctx.lineTo(this.endPoint.x - camX, this.endPoint.y - camY)
//         ctx.stroke()
//     }
// }