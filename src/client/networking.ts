import { Player } from "./shared+/player";
import { SetPlr, plr } from "./variables";

export const players:Player[] = [];

SetPlr(new Player("mulch"));
if(plr){
    players.push(plr);
}