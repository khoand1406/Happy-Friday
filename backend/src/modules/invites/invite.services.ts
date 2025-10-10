import { Injectable } from "@nestjs/common";
import { supabase, supabaseAdmin } from "src/config/database.config";
import { InviteResponse } from "./dto/invite.dto";

@Injectable()
export class InviteService{
    async getInvites(userId: string): Promise<InviteResponse[]>{
        const {data, error}= await supabaseAdmin.from("invite_event").select("*").eq("userid", userId);
        if(error){
            throw new Error("Failed to fetch invites: " + error.message);
        }
        return data as InviteResponse[];
    }
}