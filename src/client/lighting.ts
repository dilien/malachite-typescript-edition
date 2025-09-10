import { Player } from "../shared/player";
import { Vector, boxes } from "../shared/utils";
import { camPos, ctx } from "./variables";

export function generateClip(p:Vector){
    for(const id in boxes){
        const box = boxes[id]
        const points:[number, number][] = [];

        if (p.x > box[0] + box[2]){
            points[3] = [box[0]+box[2], box[1]];
            points[2] = [box[0]+box[2], box[1] + box[3]];
            if(p.y > box[1] + box[3]){
                points[1] = [box[0], box[1]+ box[3]]
            }else if(p.y < box[1]){
                points[4] = [box[0], box[1]]
            }
        }else if (p.x > box[0]){
            if(p.y > box[1] + box[3]){
                points[2] = [box[0], box[1] + box[3]];
                points[3] = [box[0] + box[2], box[1] + box[3]];
            }else{
                points[3] = [box[0], box[1]];
                points[2] = [box[0] + box[2], box[1]];
            }
        }else{
            points[2] = [box[0], box[1]];
            points[3] = [box[0], box[1] + box[3]];
            if(p.y > box[1] + box[3]){
                points[4] = [box[0]+box[2], box[1]+ box[3]]
            }else if(p.y < box[1]){
                points[1] = [box[0]+box[2], box[1]]
            }
        }
        let first = points[1] || points[2]
        let diff = [first[0] - p.x, first[1] - p.y]
        first = [first[0] + diff[0] * 50, first[1] + diff[1] * 50]

        let last = points[4] || points[3]
        diff = [last[0] - p.x, last[1] - p.y]
        last = [last[0] + diff[0] * 50, last[1] + diff[1] * 50]

        ctx.beginPath();
        ctx.rect(0, 0, 800, 800); // Outer rectangle
        ctx.translate(-camPos.x, -camPos.y)
        ctx.moveTo(first[0], first[1]);
        for(let i in points){
            let point = points[i]
            ctx.lineTo(point[0], point[1]);
        }
        ctx.lineTo(last[0], last[1]);
        ctx.lineTo(first[0], first[1]);
        ctx.resetTransform()
        //ctx.fillStyle = "white"
        //ctx.fill()
        ctx.clip();
    }
}

export function finalFill(p:Vector){
    ctx.fillStyle = "black"
    for(const id in boxes){
        const box = boxes[id]
        
        const points:[number, number][] = [];

        if (p.x > box[0] + box[2]){
            points[3] = [box[0]+box[2], box[1]];
            points[2] = [box[0]+box[2], box[1] + box[3]];
            if(p.y > box[1] + box[3]){
                points[1] = [box[0], box[1]+ box[3]]
            }else if(p.y < box[1]){
                points[4] = [box[0], box[1]]
            }
        }else if (p.x > box[0]){
            if(p.y > box[1] + box[3]){
                points[2] = [box[0], box[1] + box[3]];
                points[3] = [box[0] + box[2], box[1] + box[3]];
            }else{
                points[3] = [box[0], box[1]];
                points[2] = [box[0] + box[2], box[1]];
            }
        }else{
            points[2] = [box[0], box[1]];
            points[3] = [box[0], box[1] + box[3]];
            if(p.y > box[1] + box[3]){
                points[4] = [box[0]+box[2], box[1]+ box[3]]
            }else if(p.y < box[1]){
                points[1] = [box[0]+box[2], box[1]]
            }
        }
        let first = points[1] || points[2]
        let diff = [first[0] - p.x, first[1] - p.y]
        first = [first[0] + diff[0] * 50, first[1] + diff[1] * 50]

        let last = points[4] || points[3]
        diff = [last[0] - p.x, last[1] - p.y]
        last = [last[0] + diff[0] * 50, last[1] + diff[1] * 50]

        ctx.beginPath();
        ctx.translate(-camPos.x, -camPos.y)
        ctx.moveTo(first[0], first[1]);
        for(let i in points){
            const point = points[i]
            ctx.lineTo(point[0], point[1]);
        }
        ctx.lineTo(last[0], last[1]);
        ctx.lineTo(first[0], first[1]);
        ctx.resetTransform()
        ctx.fill()
    }
}

export function spotLight(){
    const grad=ctx.createRadialGradient(0,0,0,0,0,400);
    grad.addColorStop(0,"rgb(255 255 255 / 80%)");
    grad.addColorStop(1,"rgb(255 255 255 / 0%)");
    ctx.fillStyle = grad;
    ctx.beginPath()
    ctx.arc(0, 0, 400, 0, 2 * Math.PI)
    ctx.fill()
}

//the callback function is the actual light being drawn.
export async function createLighting(world:Vector, callback:()=>void):Promise<[ImageBitmap, Vector]|null>{
    let cam = world.sub(camPos);
    
    if(cam.x + 400 <= 0 || cam.x - 400 >= 800 || cam.y + 400 <= 0 || cam.y - 400 >= 800){
        return null;
    }
    const x1 = Math.max(0, cam.x-400)
    const y1 = Math.max(0, cam.y-400)
    const x2 = Math.min(800, cam.x+400)
    const y2 = Math.min(800, cam.y+400)

    // @ts-ignore
    ctx.reset()
    //for some reason the above line doesnt work, even though it totally is a valid function
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 1000, 1000);
    generateClip(world);
    
    ctx.resetTransform()
    ctx.translate(cam.x, cam.y)
    callback()
    ctx.resetTransform()

    const image = ctx.getImageData(x1, y1, x2-x1, y2-y1)
    const bitmap = await createImageBitmap(image)
    return [bitmap, new Vector(x1, y1)]
}

export async function generatePlayerLighting(player:Player){
    const muzzle = Math.max(0, player.weapon.delta - (player.weapon.data.cooldown - player.weapon.data.v.flashTime))
    if (player.flashlight || muzzle > 0){
        return await createLighting(player.pos, function(){
            if(player.flashlight){
                const grad=ctx.createRadialGradient(0,0,200,0,0,400);
                grad.addColorStop(0,"rgb(128 128 128 / 100%)");
                grad.addColorStop(1,"rgb(128 128 128 / 0%)");
                ctx.fillStyle = grad;
                ctx.beginPath()
                ctx.moveTo(0, 0)
                const a = player.rotation
                const b = 0.2 * Math.PI
                ctx.arc(0,0, 600, a-b, a+b)
                ctx.fill()
            }
            if(muzzle > 0){
                const x = Math.cos(player.rotation) * 40
                const y = Math.sin(player.rotation) * 40
                const x2 = Math.cos(player.rotation) * 60
                const y2 = Math.sin(player.rotation) * 60
                const effect = player.weapon.data.v.flashEffect;
                const grad=ctx.createRadialGradient(x2, y2,2,x2, y2, Math.max(20, (0.2 + muzzle) * 10 * 20 * effect));
                grad.addColorStop(0,"rgb(255 100 0 / 100%)");
                grad.addColorStop(0.3,"rgb(255 100 0 / 50%)");
                grad.addColorStop(1,"rgb(255 100 0 / 0%)");
                ctx.beginPath()
                ctx.moveTo(x, y)
                const a = player.rotation
                const b = 0.1 * Math.PI
                ctx.fillStyle = "rgb(255 100 0 / 100%)"
                ctx.arc(x, y, 35 * Math.sqrt(effect), a-b, a+b)
                ctx.fill()
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.fillStyle = grad
                ctx.arc(x, y, 500, 0, 2 * Math.PI)
                ctx.fill()
            }
        });
    }
}