import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Telegram | Contacto Directo",
  description: "Crea códigos QR para Telegram gratis. Tus clientes te escriben al instante sin buscar tu usuario.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Telegram"
      subtitle="Conecta con tu audiencia en Telegram. Un código QR que abre un chat directo con tu cuenta o canal."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Telegram" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Telegram?",
          content: `Un código QR para Telegram enlaza a un perfil, grupo o canal de Telegram. Al escanearlo, el usuario abre directamente la conversación o se une al canal.\n\nIdeal para comunidades, soporte al cliente y canales de difusión. El usuario no tiene que buscar tu usuario: escanea y ya está conectado.`,
        },
        {
          title: "Usos Recomendados",
          content: `Canales de difusión: los usuarios se suscriben a tu canal escaneando el código.\n\nGrupos de soporte: atención al cliente por Telegram de forma rápida y organizada.\n\nComunidades: invita a usuarios a unirse a tu grupo comunitario.\n\nBots de Telegram: enlaza directamente a tu bot para que los usuarios empiecen a usarlo.`,
        },
        {
          title: "Tipos de Enlace",
          content: `Perfil: t.me/tuusuario — abre el chat con tu cuenta.\n\nGrupo: t.me/tugrupo — abre la invitación al grupo.\n\nCanal: t.me/tucanal — abre la vista previa del canal.\n\nBot: t.me/tubot — inicia la conversación con el bot.`,
        },
        {
          title: "Consejos Prácticos",
          content: `Incluye el icono de Telegram junto al QR para identificar visualmente el destino.\n\nPara grupos, asegúrate de que la configuración de privacidad permita unirse mediante enlace.\n\nColoca el QR en tu web, redes sociales, materiales impresos y packaging.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona si el usuario no tiene Telegram?", a: "El enlace se abre en el navegador. El usuario puede ver el perfil o canal, pero necesita la app para chatear o unirse." },
        { q: "¿Puedo cambiar el destino sin cambiar el QR?", a: "No, con QR estático el destino es fijo. Con QR dinámico (plan Pro) puedes cambiarlo." },
        { q: "¿Qué enlace uso para mi perfil?", a: "t.me/tuusuario — donde tuusuario es tu nombre de usuario en Telegram." },
        { q: "¿Funciona con grupos privados?", a: "Solo si compartes el enlace de invitación del grupo. Los grupos privados requieren enlace de invitación." },
      ]}
      ctaText="Crea tu código QR para Telegram gratis"
    />
  );
}
