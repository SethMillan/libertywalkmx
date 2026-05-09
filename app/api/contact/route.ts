import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_PORT || "465") === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, vehiculo, proyecto } =
      await request.json();

    if (!nombre || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 },
      );
    }

    await transporter.sendMail({
      from: `"Liberty Walk MX" <${process.env.SMTP_USER}>`,
      to: "contacto@libertywalk.com.mx",
      cc: "gonzalodh@libertywalk.com.mx",
      replyTo: email,
      subject: `Nueva solicitud de cotización — ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0c0d0d; border-bottom: 1px solid #e0e0e0; padding-bottom: 12px;">
            Nueva Solicitud de Cotización
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555; width: 130px; vertical-align: top;"><strong>Nombre</strong></td>
              <td style="padding: 8px 0; color: #0c0d0d;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #0c0d0d;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Teléfono</strong></td>
              <td style="padding: 8px 0; color: #0c0d0d;">${telefono || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Vehículo</strong></td>
              <td style="padding: 8px 0; color: #0c0d0d;">${vehiculo || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; vertical-align: top;"><strong>Proyecto</strong></td>
              <td style="padding: 8px 0; color: #0c0d0d; white-space: pre-wrap;">${proyecto || "—"}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact/route] sendMail error:", err);
    return NextResponse.json(
      { error: "Error al enviar el correo. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
