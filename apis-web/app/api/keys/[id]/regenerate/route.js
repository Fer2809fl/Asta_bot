import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { currentUser } from "../../../../../lib/auth";
import { findKeyById, replaceKeyValue } from "../../../../../lib/store";
export async function POST(_request,{params}){const user=await currentUser();if(!user)return NextResponse.json({ok:false,error:"Inicia sesión."},{status:401});const key=await findKeyById(params.id,user.id);if(!key)return NextResponse.json({ok:false,error:"Key no encontrada."},{status:404});const keyValue=`asta_${crypto.randomBytes(18).toString("hex")}`;await replaceKeyValue(params.id,user.id,keyValue);return NextResponse.json({ok:true,key_value:keyValue})}