import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
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

    const fecha = new Date().toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await transporter.sendMail({
      from: `"Liberty Walk MX" <${process.env.SMTP_USER}>`,
      to: "contacto@libertywalk.com.mx",
      cc: "gonzalodh@libertywalk.com.mx",
      replyTo: email,
      subject: `Nueva solicitud de cotización — ${nombre}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0ee;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0ee;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#0c0d0d;padding:36px 40px 28px;">
            <p style="margin:0 0 4px;color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:4px;text-transform:uppercase;">Liberty Walk</p>
            <p style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">MÉXICO</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="border-top:1px solid rgba(255,255,255,0.12);"></td>
              </tr>
            </table>
            <p style="margin:20px 0 0;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Nueva Solicitud de Cotización</p>
          </td>
        </tr>

        <!-- HERO LABEL -->
        <tr>
          <td style="background:#e8eaea;padding:14px 40px;">
            <p style="margin:0;color:#090908;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">Solicitud recibida · ${fecha}</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">

            <!-- Cliente -->
            <p style="margin:0 0 20px;color:#0c0d0d;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;border-bottom:1px solid #e8e8e6;padding-bottom:10px;">Datos del cliente</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0ee;width:120px;vertical-align:top;">
                  <p style="margin:0;color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Nombre</p>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <p style="margin:0;color:#0c0d0d;font-size:15px;font-weight:600;">${nombre}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <p style="margin:0;color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Email</p>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <a href="mailto:${email}" style="color:#090908;font-size:15px;text-decoration:underline;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <p style="margin:0;color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Teléfono</p>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <p style="margin:0;color:#0c0d0d;font-size:15px;">${telefono || "—"}</p>
                </td>
              </tr>
            </table>

            <!-- Vehículo y proyecto -->
            <p style="margin:32px 0 20px;color:#0c0d0d;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;border-bottom:1px solid #e8e8e6;padding-bottom:10px;">Detalle del proyecto</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0ee;width:120px;vertical-align:top;">
                  <p style="margin:0;color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Vehículo</p>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0ee;vertical-align:top;">
                  <p style="margin:0;color:#0c0d0d;font-size:15px;font-weight:600;">${vehiculo || "—"}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;vertical-align:top;">
                  <p style="margin:0;color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Proyecto</p>
                </td>
                <td style="padding:10px 0 10px 16px;vertical-align:top;">
                  <p style="margin:0;color:#0c0d0d;font-size:15px;line-height:1.6;white-space:pre-wrap;">${proyecto || "—"}</p>
                </td>
              </tr>
            </table>

            <!-- CTA reply -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td align="center">
                  <a href="mailto:${email}" style="display:inline-block;background:#0c0d0d;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
                    RESPONDER AL CLIENTE →
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0c0d0d;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:2px;text-transform:uppercase;">Liberty Walk MX · Ayala Premium, Morelia, Michoacán</p>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.2);font-size:10px;">contacto@libertywalk.com.mx</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact/route] sendMail error:", message);
    return NextResponse.json(
      {
        error: "Error al enviar el correo. Intenta de nuevo.",
        debug: message,
      },
      { status: 500 },
    );
  }
}
