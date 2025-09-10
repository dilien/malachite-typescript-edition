import { Vector, check_for_collisions } from "./utils";
import {Weapon, weapons} from "./weapon";

export const players:Player[] = [];


export class Player{

    name:string;
    pos:Vector;
    rotation:number;
    flashlight:boolean;
    weapons:Weapon[];
    weapon:Weapon;
    health:number;
    bleed:number;
    armour:number;
    constructor(name:string) {
        this.name = name
        this.pos = new Vector(200, 1400)
        this.rotation = 0
        this.flashlight = true
        this.weapons = [new Weapon(weapons.smg, this), new Weapon(weapons.shotgun, this)]
        this.weapon = this.weapons[0];
        this.health = 100
        this.bleed = 0
        this.armour = 0
    }
    // render() {
    //     ctx.resetTransform()
    //     ctx.translate(this.x - camX, this.y - camY)
    //     ctx.rotate(this.rotation)
    //     ctx.drawImage(source, -60, -60)
    //     ctx.resetTransform()
    // }
    lookAt(target:Vector){
        const diff = target.sub(this.pos)
        this.rotation = Math.atan2(diff.y, diff.x)
    }
    move(change:Vector){
        const offset = new Vector(-20, -20);
        const size = new Vector(40, 40);
        if(!check_for_collisions(offset.add(this.pos).add(new Vector(change.x, 0)), size)){
            this.pos = this.pos.add(new Vector(change.x, 0))
        }
        if(!check_for_collisions(offset.add(this.pos).add(new Vector(0, change.y)), size)){
            this.pos = this.pos.add(new Vector(0, change.y))
        }
    }
    step(delta:number){
        if(this.weapon){
            this.weapon.step(delta);
        }
    }
}