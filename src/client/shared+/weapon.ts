import { Vector } from "../../shared/utils";
import { Weapon as w } from "../../shared/weapon";
import {  plr } from "../variables";
import { sock } from "../client";
import {  recoil } from "../controls";
import { FireEvent } from "../../shared/networking";

export class Weapon extends w{
    test:number = 5;
    fire() {
        console.log("fire B");
        super.fire();

        if(this.owner == plr){
            const data:FireEvent = {type:"fire", name:plr.name}
            sock.send(JSON.stringify(data))

            recoil(plr, this);
        }
    }
}