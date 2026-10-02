import { NextResponse } from "next/server";
import { currentUser } from "../../../../lib/auth";
import { deleteKey, findKeyById } from "../../../../lib/store";
export async function DELETE(_request,{params}){const user=await currentUser();if(!user)return NextResponse.json({ok:false,error:"Inicia sesión."},{status:401});const key=await findKeyById(params.id,user.id);if(!key)return NextResponse.json({ok:false,error:"Key no encontrada."},{status:404});await deleteKey(params.id,user.id);return NextResponse.json({ok:true})}