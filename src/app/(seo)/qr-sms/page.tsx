import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para SMS | Mensaje Directo",
  description: "Crea códigos QR para SMS gratis. Tus clientes te envían un mensaje de texto al instante al escanear el código.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para SMS"
      subtitle="Recibe mensajes de texto al instante. Crea un código QR que abre un SMS nuevo con tu número y mensaje predefinido."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR SMS" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para SMS?",
          content: `Un código QR para SMS almacena un número de teléfono y opcionalmente un mensaje predefinido. Al escanearlo, se abre la aplicación de mensajes con el destinatario y el texto listo para enviar.\n\nIdeal para campañas donde el SMS tiene mejor tasa de apertura que el email. También útil para canales de comunicación rápidos sin necesidad de internet.`,
        },
        {
          title: "Usos Recomendados",
          content: `Campañas de marketing SMS: "Envía la palabra OFERTA al 12345 y recibe un descuento".\n\nSoporte al cliente: canal de texto directo sin WhatsApp ni apps.\n\nConfirmaciones y pedidos: los clientes confirman su pedido por SMS desde la tienda.\n\nCódigos de verificación y eventos: los asistentes envían un SMS para registrarse o confirmar asistencia.`,
        },
        {
          title: "Mensaje Predefinido",
          content: `Puedes incluir un texto que aparezca automáticamente en el cuerpo del mensaje. Por ejemplo: "Hola, quiero información sobre..." o "ALTA 12345".\n\nEsto facilita que el usuario envíe el SMS sin tener que redactar. Asegura que recibes mensajes estructurados y fáciles de procesar.`,
        },
        {
          title: "Consejos Prácticos",
          content: `Usa mensajes cortos: el SMS tiene un límite de 160 caracteres. Mensajes más largos se dividen en varios SMS.\n\nIncluye una llamada a la acción clara junto al QR: "Escanea y envíanos un SMS".\n\nPrueba siempre el código antes de imprimirlo en materiales promocionales.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona sin internet?", a: "Sí, los SMS funcionan sobre la red telefónica. No necesitan datos móviles." },
        { q: "¿Puedo predefinir el mensaje completo?", a: "Sí, puedes incluir el texto que aparecerá en el cuerpo del SMS." },
        { q: "¿Tiene límite de caracteres el mensaje?", a: "El SMS estándar tiene 160 caracteres. Mensajes más largos se cobran como múltiples SMS." },
        { q: "¿Funciona con cualquier móvil?", a: "Sí, todos los móviles tienen aplicación de SMS nativa. No requiere apps adicionales." },
      ]}
      ctaText="Crea tu código QR para SMS gratis"
    />
  );
}
