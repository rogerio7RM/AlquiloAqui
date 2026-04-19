# Alquilo Aqui

Catalogo web estilo marketplace para `Alquilo Aqui`, inspirado en el flujo publico de Amovens pero simplificado para alquileres mensuales cerrados por WhatsApp.

## Incluye

- Portada con CTA directo a WhatsApp.
- Catalogo de coches y furgonetas con filtros por tipo, texto, inicio y plazo.
- Alquiler mensual con opciones de `1 mes`, `3 meses` y `12 meses o mas`.
- Precio mensual visible en cada vehiculo.
- Subida directa de imagenes `JPG/PNG` para cada vehiculo desde el panel de gestion.
- Panel de gestion protegido por clave para crear, editar y eliminar vehiculos.
- Calendario mensual con bloqueos de fechas por vehiculo.

## Acceso de gestion

- Clave inicial: `AlquiloAqui2026!`
- Se puede cambiar desde el propio panel.

## Persistencia

La gestion se guarda en `localStorage` como copia local y tambien puede sincronizarse con Firebase Realtime Database.

Si `config.js` esta vacio, el sitio funciona en modo local:

- Los cambios se guardan en ese navegador y en ese dispositivo.
- Es util como respaldo, pero no sincroniza tablet, movil y ordenador.

Para que cualquier cambio hecho desde un aparato aparezca en todos los demas:

1. Crea un proyecto en Firebase.
2. Activa `Realtime Database`.
3. Activa `Authentication` con proveedor `Email/Password`.
4. Crea un usuario administrador con email y clave.
5. Copia la configuracion web de Firebase dentro de `config.js`.
6. Pon el email administrador en `window.ALQUILO_AQUI_ADMIN_EMAIL`.
7. En las reglas de Realtime Database, usa como base `firebase-rules.example.json` y cambia `admin@tudominio.com` por el email administrador real.

El catalogo se guarda en esta ruta de Realtime Database:

```text
alquilo-aqui/catalogo
```

Con Firebase configurado, la pagina escucha cambios en tiempo real. Si editas un coche, bloqueas fechas o cambias el WhatsApp desde el tablet, las otras paginas abiertas se actualizan automaticamente sin tener que tocar el HTML.

## Archivos

- `index.html`: estructura principal del sitio y modales de gestion.
- `styles.css`: visual, layout responsive y calendario.
- `app.js`: catalogo mensual, filtros, CTA de WhatsApp, gestion de vehiculos y bloqueos.
- `config.js`: configuracion Firebase opcional para sincronizar entre dispositivos.
- `firebase-rules.example.json`: ejemplo de reglas seguras para permitir lectura publica y escritura solo al administrador autenticado.
- `assets/logo-alquilo-aqui.png`: logo principal.
- `CNAME`: dominio personalizado para GitHub Pages.
