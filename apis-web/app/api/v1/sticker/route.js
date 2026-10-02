import { NextResponse } from "next/server";
import { authorizeKey, finish } from "../../../../lib/guard";
import { stickerFromUrl } from "../../../../lib/scrapers";
export async function GET(request){
 const auth=await authorizeKey(request,"sticker"); if(auth.error)return NextResponse.json({success:false,error:auth.error,meta:auth.meta},{status:auth.status});
 const url=new URL(request.url).searchParams.get("url")||"";
 try{return NextResponse.json(await finish(auth,"sticker",await stickerFromUrl(url)));}catch(err){return NextResponse.json({success:false,error:err.message||"No se pudo leer la imagen."},{status:400});}
}