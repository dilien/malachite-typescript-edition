import {  WebSocket, WebSocketServer } from "ws";
import { Player } from "../shared/player";
import { process_message } from "./networking";

const clearup_disconnected = true;

const clients:ExtWebSocket[] = [];

interface ExtWebSocket extends WebSocket {
    ip: string|undefined;
    player:Player;
}

export const players:Player[] = [];

export function send_all(message:string) {
    for (var i = 0; i < clients.length; i++) {
        clients[i].send(message);
    }
}

export function startup(ws_port:number){
    var s = new WebSocketServer({ port: ws_port })
    s.on('connection', function (ws_b, req) {
        const ws = ws_b as ExtWebSocket;
        ws.ip = req.socket.remoteAddress;
        clients.push(ws);

        players.push(new Player(String(ws.ip)))
        ws.player = players[-1];
    
        ws.on('message', async function (message) {
            const data = JSON.parse(String(message));
            process_message(ws.player, String(message), data as NetEvent);
        })
    
        ws.on("close", async function (message) {
            if (clearup_disconnected) {
                const id = clients.indexOf(ws);
                clients.splice(id, 1);
            }
        })
    })
    console.log("Websocket Server up");
}

