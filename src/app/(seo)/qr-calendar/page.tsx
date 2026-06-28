import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Calendario | Eventos",
  description: "Crea códigos QR para calendario gratis. Tus clientes añaden eventos a su calendario con un escaneo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Calendario"
      subtitle="Crea eventos que se guardan solos. Un escaneo y el evento se añade al calendario del usuario."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Calendario" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Calendario?",
          content: `Un código QR para calendario contiene los datos de un evento: título, fecha, hora, duración, descripción y ubicación. Al escanearlo, el usuario puede añadir el evento directamente a su calendario.\n\nIdeal para webinars, conciertos, cursos, reuniones, citas médicas o cualquier evento con fecha y hora concretas. El usuario no tiene que escribir nada manualmente.`,
        },
        {
          title: "Usos Recomendados",
          content: `Conferencias y webinars: los asistentes guardan la fecha y el enlace de acceso.\n\nClases y talleres: programa completo con fechas, horas y aula.\n\nEventos deportivos: los aficionados guardan el partido en su calendario.\n\nCitas médicas: la clínica comparte el QR con la cita programada.\n\nReuniones de negocios: envías el QR con la invitación y la ubicación.`,
        },
        {
          title: "Datos del Evento",
          content: `Puedes incluir: título del evento, fecha de inicio y fin, hora con zona horaria, descripción detallada, ubicación física o URL de videollamada.\n\nTodos estos datos se transfieren al calendario del usuario (Google Calendar, Apple Calendar, Outlook) cuando escanea el código.`,
        },
        {
          title: "Zona Horaria",
          content: `Es importante configurar la zona horaria correcta para que el evento aparezca a la hora adecuada en el calendario del usuario.\n\nNuestro generador usa la zona horaria que especifiques. Si no estás seguro, usa la zona horaria de la ubicación del evento.`,
        },
      ]}
      faqs={[
        { q: "¿Con qué calendarios es compatible?", a: "Con todos los principales: Google Calendar, Apple Calendar, Outlook y cualquier calendario que soporte archivos .ics." },
        { q: "¿Puedo incluir un enlace de videollamada?", a: "Sí, puedes añadir una URL en la descripción o como ubicación del evento." },
        { q: "¿El evento se actualiza si cambio la fecha?", a: "No, los datos están grabados en el QR. Si cambia la fecha, genera un nuevo código." },
        { q: "¿Funciona la zona horaria automáticamente?", a: "El evento se crea con la zona horaria que configures. El calendario del usuario lo convierte a su zona local." },
      ]}
      ctaText="Crea tu código QR de calendario gratis"
    />
  );
}
