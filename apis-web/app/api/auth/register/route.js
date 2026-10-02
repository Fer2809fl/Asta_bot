import { NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  clearAttempts,
  hashPassword,
  sessionCookie,
  signSession,
  tooManyAttempts,
  validateRegister,
} from "../../../../lib/auth";
import { databaseReady, countUsers, createUser, findUserByEmail, findUserByUsername } from "../../../../lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirm = String(body.confirm || "");

    const error = validateRegister({ username, email, password });
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    if (password !== confirm) return NextResponse.json({ ok: false, error: "Las contraseñas no coinciden." }, { status: 400 });
    if (!databaseReady()) return NextResponse.json({ ok: false, error: "En Vercel falta la base de datos. Conecta Neon en Storage y vuelve a desplegar. Sin eso las cuentas no se pueden guardar." }, { status: 500 });
    if (tooManyAttempts(`reg:${email}`)) return NextResponse.json({ ok: false, error: "Demasiados intentos. Espera unos minutos." }, { status: 429 });
    if (await findUserByEmail(email)) return NextResponse.json({ ok: false, error: "Ese correo ya está registrado." }, { status: 409 });
    if (await findUserByUsername(username.toLowerCase())) return NextResponse.json({ ok: false, error: "Ese usuario ya existe." }, { status: 409 });

    const role = (await countUsers()) === 0 ? "admin" : "user";
    const user = { id: crypto.randomUUID(), username: username.toLowerCase(), email, password_hash: await hashPassword(password), role, created_at: new Date().toISOString() };
    await createUser(user);
    clearAttempts(`reg:${email}`);
    const token = await signSession(user.id);
    const cookie = sessionCookie(token);
    const res = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  } catch (err) {
    const message = String(err?.message || "");
    if (message.includes("EROFS") || message.includes("EACCES") || message.includes("readonly")) return NextResponse.json({ ok: false, error: "En Vercel hace falta una base Postgres. Conecta Neon y vuelve a desplegar." }, { status: 500 });
    return NextResponse.json({ ok: false, error: "No se pudo crear la cuenta. Revisa la base de datos." }, { status: 500 });
  }
}
