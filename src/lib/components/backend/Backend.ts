export const backendURL = "http://127.0.0.1:8000";
/*
    these functions are to be called in +server.ts, 
    +page.server.ts, +layout.server.ts files only

    these functions will not function and are not meant to function in
    the browser
*/

export interface Result<T>{
    result:boolean;
    object:T;
    error:string;
}