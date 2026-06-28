import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Código QR Multi-Enlace | Redirige según Día y Hora",
  description: "Crea un código QR que redirige a diferentes enlaces según el día de la semana o la hora del día. Un solo QR, múltiples destinos.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR Multi-Enlace"
      subtitle="Un QR que cambia según cuándo se escanee. Diferentes destinos para diferentes momentos."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Multi-Enlace" },
      ]}
      sections={[
        {
          title: "¿Qué es un QR multi-enlace?",
          content: `Es un código QR inteligente que redirige a diferentes URLs según el día de la semana o la hora del día en que se escanea.\n\nPor ejemplo: de lunes a viernes redirige a tu horario laboral, los fines de semana a un mensaje de "cerrado". O por la mañana al menú del desayuno y por la tarde al menú de la cena. Todo con un solo QR impreso.`,
        },
        {
          title: "Casos de uso reales",
          content: `Restaurantes: un QR en la puerta que muestra el horario de apertura entre semana y un mensaje diferente los domingos.\n\nClínicas y consultas: redirige a la agenda de citas en horas laborables y a un formulario de contacto fuera del horario.\n\nTiendas: horario comercial vs. tienda online cuando están cerrados.\n\nEventos: contenido diferente para cada día del evento (agenda del día 1, día 2, etc.) con el mismo QR en la acreditación.\n\nProfesionales: link a calendario de reservas en horas hábiles, link a WhatsApp en horas libres.`,
        },
        {
          title: "Cómo configurarlo",
          content: `Creas el QR y añades tantas reglas como necesites. Cada regla tiene: día(s) de la semana, hora de inicio y fin, y la URL de destino.\n\nSi ninguna regla coincide, puedes configurar un destino por defecto. El sistema evalúa las reglas en orden y usa la primera que coincida con el momento actual.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona en cualquier huso horario?", a: "Usamos la hora del servidor. Si necesitas un huso específico, indícalo al crear el QR." },
        { q: "¿Puedo tener reglas sin límite de hora?", a: "Sí, puedes dejar hora en blanco para que aplique todo el día en esos días de la semana." },
        { q: "¿Puedo cambiar las reglas después?", a: "Sí, con los QR dinámicos puedes modificar las reglas de redirección en cualquier momento desde tu panel." },
        { q: "¿Cuántas reglas puedo tener?", a: "Puedes añadir tantas reglas como necesites. Cada regla es independiente." },
      ]}
      ctaText="Crea tu QR multi-enlace gratis"
    />
  );
}
