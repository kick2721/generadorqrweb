<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:i18n-rule -->
# i18n: todo texto visible debe tener clave en 23 idiomas

TODO el texto visible en la interfaz debe tener su clave en los 23 idiomas en `src/lib/i18n.ts`.
Antes de dar por terminado cualquier cambio, verificar con `grep` que no haya textos
hardcodeados en español en los archivos modificados.

## ⚠️ CRITICAL: No dañar la codificación UTF-8

`src/lib/i18n.ts` contiene caracteres no-ASCII (á, é, ñ, árabe, griego, japonés, coreano, chino, etc.).
NUNCA editar este archivo con herramientas que puedan alterar la codificación (PowerShell Set-Content,
cmd, etc.). Usar SOLO Node.js (fs.readFileSync/writeFileSync con 'utf8') o el tool Edit del agente
para modificar este archivo. Si se daña, restaurar con `git checkout HEAD -- src/lib/i18n.ts`.
<!-- END:i18n-rule -->

<!-- BEGIN:no-breakage -->
# No romper funcionalidad existente

Nunca preferir destruir funcionalidad actual. Siempre mejorar sin romper lo que funciona.
Si un cambio puede romper algo existente, preguntar antes.
<!-- END:no-breakage -->

<!-- BEGIN:scan-tracking -->
# Scan tracking por tipo QR

Los tipos que redirigen inmediatamente (url, location, etc.) usan tracking servidor automático en `page.tsx`.

Los tipos que muestran componente interactivo con botón (phone, sms, calendar) deben:
1. Excluirse del tracking servidor en `page.tsx` (línea 48, agregar al `if`)
2. Pasar `qrId` al componente
3. Usar `trackScan()` vía POST `/api/scan` al hacer clic (con dedup de sessionStorage)

Cualquier tipo nuevo que abra app externa o requiera clic del usuario sigue este patrón.

Si el tipo no puede trackear por limitaciones técnicas (ej: vCard), se deja el tracking servidor en page load y no se fuerza tracking cliente.
<!-- END:scan-tracking -->
