export interface NetworkEvent{
    type:string;
}

export interface FireEvent extends NetworkEvent{
    type:"fire";
    name:string;
}

export interface OtherEvent extends NetworkEvent{
    type:"other";
    name:string;
}
