//two different types of import
import * as console from "./console";
import * as websocket from "./websocket";


websocket.startup(5001);
console.loop();