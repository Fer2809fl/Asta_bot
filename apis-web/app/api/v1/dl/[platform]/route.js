import { NextResponse } from "next/server";
import { authorizeKey, finish } from "../../../../../lib/guard";
import { facebookScrape, instagramScrape, tiktokScrape, youtubeScrape } from "../../../../../lib/scrapers";
const HANDLERS = { instagram:(url)=>instagramScrape(url), facebook:(url)=>facebookScrape(url), tiktok:(url)=>tiktokScrape(url), youtube:(url,request)=>youtubeScrape(url,new URL(request.url).searchParams.get("type")||"video") };
export async function GET(request,{params}) {
 const platform=params.platform; if(!HANDLERS[platform]) return NextResponse.json({success:false,error:"Plataforma no disponible."},{status:404});
 const auth=await authorizeKey(request,platform); if(auth.error) return NextResponse.json({success:false,error:auth.error,meta:auth.meta},{status:auth.status});
 const url=new URL(request.url).searchParams.get("url")||""; if(!url) return NextResponse.json({success:false,error:"Falta el parámetro url."},{status:400});
 try{return NextResponse.json(await finish(auth,platform,await HANDLERS[platform](url,request)));}catch(err){return NextResponse.json({success:false,error:err.message||"No se pudo scrapear ese enlace."},{status:502});}
}