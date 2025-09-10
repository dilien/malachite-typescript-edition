import { Player as p } from "../../shared/player";
import { weapons } from "../../shared/weapon";
import { camPos, ctx } from "../variables";
import { Weapon } from "./weapon";

const source:HTMLImageElement = document.getElementById("source") as unknown as HTMLImageElement;

console.log("hello");
export class Player extends p{
    declare weapon: Weapon;
    declare weapons: Weapon[];
    constructor(name:string) {
        super(name);
        this.weapons = [new Weapon(weapons.smg, this), new Weapon(weapons.shotgun, this)];
        this.weapon = this.weapons[0];
    }
    render() {
        ctx.resetTransform()
        const screenPos = this.pos.sub(camPos)
        ctx.translate(screenPos.x, screenPos.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(source, -60, -60)
        ctx.resetTransform()
    }
}