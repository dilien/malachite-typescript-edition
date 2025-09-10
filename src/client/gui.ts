import { ctx, plr, screenSize } from "./variables"

//Makes sure its always the right type, no chance for null
const spritesheet = document.getElementById("spritesheet") as unknown as HTMLImageElement;

//screen size
export function renderGUI(){
    if(!plr){return;}
    //inventory (top left)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#156B33"
    for(let i = 0; i<plr.weapons.length; i++){
        const weapon = plr.weapons[i]

        if(weapon == plr.weapon){ //equipped
            ctx.fillStyle = "#156B3366";
        }else{
            ctx.fillStyle = "#0B381B88";
        }
        ctx.beginPath();
        ctx.roundRect(10, 10 + i * 60, 120, 50, 20);
        ctx.stroke();
        ctx.fill();

        const c = weapon.data.v.uiCoord
        ctx.drawImage(spritesheet, c[0], c[1], c[2], c[3], 11, 11 + i * 60, c[2], c[3]);
    }

    //ammo counter
    if(plr.weapon){
        const c = plr.weapon.data.v.ammoCoord
        for(let i = 0; i<plr.weapon.ammo; i++){
            ctx.drawImage(spritesheet, c[0], c[1], c[2], c[3], screenSize.x - 50 - c[2] - i * c[2], screenSize.y - 10 - c[3], c[2], c[3]);
        }
    }

    //health bar
    ctx.beginPath();
    ctx.roundRect(screenSize.x - 10, screenSize.y-10, -30, -100, 10);
    ctx.stroke();
    ctx.fill();

    //bleed
    if(plr.bleed > 0){
        const bleed = Math.min(100, plr.health + plr.bleed)
        const curve = Math.max(0, bleed - 90)
        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.roundRect(screenSize.x - 10, screenSize.y-10, -30, -bleed, [10, 10, curve, curve]);
        ctx.fill();
    }

    const health = plr.health;
    const curve = Math.max(0, health - 90)
    ctx.fillStyle = "white"
    ctx.beginPath();
    ctx.roundRect(screenSize.x - 10, screenSize.y-10, -30, -health, [10, 10, curve, curve]);
    ctx.fill();
}

