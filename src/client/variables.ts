import { Vector } from "../shared/utils";
import { Player } from "./shared+/player";


export let plr:(Player|null) = null;
export const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
export const ctx = canvas.getContext("2d", { willReadFrequently: true }) as unknown as CanvasRenderingContext2D;
export var camPos:Vector = new Vector(0, 0);
export const screenSize = new Vector(800, 800)

export function SetCamPos(v:Vector){
    camPos = v;
}
export function SetPlr(a:Player){
    plr = a;
}