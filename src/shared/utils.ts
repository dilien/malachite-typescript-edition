"use strict";

import {players, Player} from "./player";


export const boxes = [
    [0,1450,1500,50],[1450,0,50,1500],[0,0,1500,50],[0,0,50,1500],[50,1150,150,50],[300,1150,900,50],[300,1200,50,150],[450,1300,50,150],[600,1300,750,50],[1300,1150,50,150],[1150,1000,300,50],[150,1000,750,50],[1000,900,50,150],[800,600,250,300],[1150,600,200,300],[800,250,550,250],[1050,150,50,100],[1250,50,50,100],[850,50,50,100],[650,600,50,400],[650,50,50,450],[500,150,50,750],[400,400,100,250],[150,750,250,150],[150,600,150,150],[150,150,250,150],[150,300,150,200],
]

export class Vector{
    x:number;
    y:number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    add(vector:Vector){
        return new Vector(vector.x + this.x, vector.y + this.y);
    }
    sub(vector:Vector){
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    mult(float:number){
        return new Vector(this.x * float, this.y * float);
    }
    multV(vector:Vector){
        return new Vector(this.x * vector.x, this.y * vector.y);
    }
    div(float:number){
        return new Vector(this.x / float, this.y / float);
    }
    divV(vector:Vector){
        return new Vector(this.x / vector.x, this.y / vector.y);
    }
    dist(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normal(){
        return this.div(this.dist());
    }
    asAngle(){
        return Math.atan2(this.y, this.x);
    }
    rotate(radians:number){
        const newAngle = this.asAngle() + radians;
        return new Vector(Math.cos(newAngle), Math.sin(newAngle)).mult(this.dist());
    }
    reverse(){
        return new Vector(this.x, this.y).mult(-1);
    }
}

export function castRayBox(start:Vector, direction:Vector):[Vector, boolean]{
    return castRay(start, direction, check_for_point);
}
export function castRayPlayer(start:Vector, direction:Vector):[Vector, Player]{
    return castRay(start, direction, check_for_player);
}

function castRay(start:Vector, direction:Vector, checkFunc: (a: Vector) => (any)):[Vector,(any)] {
    direction = direction.normal();
    let step = 64;
    let current = start.add(direction.mult(32));
    let hitOnce = false;
    let lastHit = false;
    for(let i = 0; i<50;i++){
        const hit = checkFunc(current);
        if(hit){lastHit = hit}
        hitOnce = hit || hitOnce;
        if(hitOnce){
            step = step / 2;
            if(Math.abs(step) < 1){
                break;
            }
            if(hit){
                step = -Math.abs(step);
            }else{
                step = Math.abs(step);
            }
        }
        current = current.add(direction.mult(step));
    }
    return [current, lastHit] ;
}
export function check_for_collisions(pos:Vector, size:Vector){
    for(const id in boxes){
        const box = boxes[id];
        if(pos.x + size.x >= box[0] && pos.x <= box[0] + box[2] && pos.y <= box[1] + box[3] && pos.y + size.y >= box[1]){
            return true;
        }
    }
    return false;
}
export function check_for_point(point:Vector){
    for(const id in boxes){
        const box = boxes[id];
        if(point.x > box[0] && point.x < box[0] + box[2] && point.y>box[1] && point.y < box[1] + box[3]){
            return true;
        }
    }
    return false;
}
export function check_for_player(point:Vector){
    for(const id in players){
        const p = players[id].pos;
        if(point.x >  p.x - 20 && point.x < p.x + 20 && point.y>p.y - 20 && point.y < p.y + 20){
            return id;
        }
    }
    return false;
}