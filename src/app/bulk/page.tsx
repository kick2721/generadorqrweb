import type { Metadata } from "next";
import BulkQR from "@/components/BulkQR";

export const metadata: Metadata = {
  title: "Generación Masiva de Códigos QR | Bulk QR Generator",
  description: "Genera cientos de códigos QR desde un archivo CSV. Descarga un ZIP con todos los QR en formato SVG.",
};

export default function BulkPage() {
  return <BulkQR />;
}
