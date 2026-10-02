import { NextResponse } from "next/server";
import { ENDPOINTS, FREE_DAILY_LIMIT } from "../../../../lib/endpoints";
import { readKey } from "../../../../lib/guard";
import { usageForKeys } from "../../../../lib/store";
export async function GET(request){
 const auth=await readKey(request); if(auth.error)return NextResponse.json({success:false,error:auth.error},{status:auth.status});
 const day=new Date().toISOString().slice(0,10); const usage=await usageForKeys([auth.key.id],day); const limit=auth.user.role==="admin"?-1:FREE_DAILY_LIMIT;
 return NextResponse.json({success:true,tier:auth.user.role,dailyLimit:limit<0?"unlimited":limit,endpoints:ENDPOINTS.map(e=>{const row=usage.find(u=>u.endpoint===e.id);const used=Number(row?.count||0);return{id:e.id,label:e.label,used,limit,remaining:limit<0?-1:Math.max(0,limit-used)}})});
}