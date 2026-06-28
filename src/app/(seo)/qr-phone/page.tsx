import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Teléfono | Llamada Directa",
  description: "Crea códigos QR para teléfono gratis. Al escanear, el usuario llama directamente al número sin marcarlo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Teléfono"
      subtitle="Inicia llamadas con un escaneo. Crea un código QR que abre el marcador con tu número listo para llamar."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Teléfono" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Teléfono?",
          content: `Un código QR para teléfono almacena un número de teléfono. Al escanearlo, el dispositivo abre el marcador con ese número listo para llamar.\n\nEl usuario solo pulsa el botón de llamada. No tiene que recordar ni escribir el número. Ideal para servicios donde la llamada directa es la acción principal.`,
        },
        {
          title: "Usos para tu Negocio",
          content: `Servicio al cliente: los clientes llaman directamente desde el escaparate o el ticket de compra.\n\nSoporte técnico: canal de llamada rápida sin buscar el número en la web.\n\nContacto de emergencia: bomberos, policía, servicios médicos en lugares públicos.\n\nInmobiliarias y agencias: los interesados llaman al instante desde el cartel de "Se vende" o "Se alquila".`,
        },
        {
          title: "Números Internacionales",
          content: `Puedes usar cualquier número en formato internacional. Incluye el código del país (+34 para España, +52 para México, +1 para EE.UU.) y el código de área sin el 0 inicial.\n\nEl QR funciona correctamente desde cualquier país. Quien escanea ve el número con el formato correcto para su operador.`,
        },
        {
          title: "Dónde Colocarlo",
          content: `En carteles de "Se vende" o "Se alquila" para contacto inmediato.\n\nEn el escaparate de tu negocio para llamadas fuera del horario laboral.\n\nEn tarjetas de visita y folletos publicitarios.\n\nEn stands de ferias y eventos comerciales.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona en cualquier país?", a: "Sí, siempre que uses el formato internacional con el código de país." },
        { q: "¿Puedo cambiar el número sin cambiar el QR?", a: "No, el número está grabado en el código. Para números variables usa QR dinámico." },
        { q: "¿Qué ocurre si el usuario no tiene saldo?", a: "El marcador se abre igualmente. La llamada dependerá del plan del usuario." },
        { q: "¿Funciona con VoIP?", a: "El QR solo almacena el número. La llamada se realiza a través del cliente nativo del dispositivo." },
      ]}
      ctaText="Crea tu código QR de teléfono gratis"
    />
  );
}
