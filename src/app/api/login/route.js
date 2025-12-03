import { google } from "googleapis";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// Usuarios predefinidos
const USERS = [
  { user: "admin", pass: "12345" },
  { user: "santiago", pass: "12345" },
  { user: "user1", pass: "12345" },
  { user: "user2", pass: "12345" },
];

// Autenticación con Google (Sheets API)
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(req) {
  try {
    const { user, pass } = await req.json();
     const hashedPass = bcrypt.hashSync(pass, 10);

    // 1️⃣ Validación de usuario predefinido
    const foundUser = USERS.find(
      (u) => u.user === user && u.pass === pass
    );

    if (!foundUser) {
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // 2️⃣ Registrar en Google Sheets
    try {
      const sheets = await getSheetsClient();

      const sheetId = process.env.GOOGLE_SHEET_ID;
      const timestamp = new Date().toLocaleString("es-AR");
    
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Hoja 1!A:C",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              user,
              hashedPass, // si querés la encriptamos después
              timestamp,
            ],
          ],
        },
      });
    } catch (err) {
      console.error("❌ Error guardando en Google Sheets:", err);
    }

    // 3️⃣ Notificación automática en Make (opcional)
    try {
      if (process.env.MAKE_WEBHOOK_URL) {
          console.log(user, new Date().toLocaleString("es-AR"));
        await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user,
            hour: new Date().toLocaleString("es-AR"),
          }),
        });
      }
    } catch (err) {
      console.error("❌ Error enviando a Make:", err);
    }

    // 4️⃣ Respuesta al frontend
    return NextResponse.json({
      ok: true,
      user,
      message: "Login exitoso",
    });
  } catch (error) {
    console.error("❌ Error API Login:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
