import { NextResponse } from "next/server";
import { authorizeKey, finish } from "../../../../../lib/guard";
import { tiktokProfile, tiktokSearch } from "../../../../../lib/scrapers";
export async function GET(request,{params}){
 const action=params.action; const endpointId=action==="profile"?"tiktok-profile":action==="search"?"tiktok-search":"";
 if(!endpointId)return NextResponse.json({success:false,error:"Acción no disponible."},{status:404});
 const auth=await authorizeKey(request,endpointId); if(auth.error)return NextResponse.json({success:false,error:auth.error,meta:auth.meta},{status:auth.status});
 const url=new URL(request.url);
 try{const data=action==="profile"?await tiktokProfile(url.searchParams.get("user")||""):await tiktokSearch(url.searchParams.get("q")||"");return NextResponse.json(await finish(auth,endpointId,data));}catch(err){return NextResponse.json({success:false,error:err.message||"No se pudo completar la búsqueda."},{status:502});}
}