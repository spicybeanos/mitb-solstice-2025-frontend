import {CACHE_MASTER_SALT} from '$env/static/private';
import { createHmac } from "crypto";
import type { Result } from "./Backend";
import type { SolsticeUser } from "./BackendTypes";
import type { Cookies } from "@sveltejs/kit";

const salt = `${CACHE_MASTER_SALT}`;
export function generateChecksum(data: object): string {
    return createHmac("sha256", salt).update(JSON.stringify(data)).digest("hex");
}


export function verifyUserInfoCookie(userJson:string|null|undefined,checksum:string|null|undefined) : Result<SolsticeUser> {
    try {
        if(!userJson || !checksum){return {success:false,error:'no cookies',result:null};}

        const userInfo = JSON.parse(userJson);
        const expected = generateChecksum(userInfo);

        if(expected != checksum){
            return {success:false,error:'tampered',result:null};
        }

        return {success:true,result:userInfo,error:null}
    } 
    catch 
    {
        return {success:false,error:'failed',result:null};
    }
}