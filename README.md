# Alquilo Aqui

Catalogo web estilo marketplace para `Alquilo Aqui`, inspirado en el flujo publico de Amovens pero simplificado para reservas cerradas por WhatsApp.

## Incluye

- Portada con CTA directo a WhatsApp.
- Catalogo de coches y furgonetas con filtros por tipo, texto y disponibilidad.
- Vehiculos visibles aunque esten no disponibles.
- Panel de gestion protegido por clave para crear, editar y eliminar vehiculos.
- Calendario mensual con bloqueos de fechas por vehiculo.

## Acceso de gestion

- Clave inicial: `AlquiloAqui2026!`
- Se puede cambiar desde el propio panel.

## Persistencia

La gestion se guarda en `localStorage` del navegador. Eso permite usarlo ya mismo en una web estatica, pero tiene una limitacion importante:

- Los cambios se guardan en ese navegador y en ese dispositivo.
- Si quieres que la gestion quede sincronizada para todos los visitantes y administradores, el siguiente paso es conectar este front-end a un backend o base de datos remota.

## Archivos

- `index.html`: estructura principal del sitio y modales de gestion.
- `styles.css`: visual, layout responsive y calendario.
- `app.js`: catalogo, filtros, CTA de WhatsApp, gestion de vehiculos y bloqueos.
- `assets/logo-alquilo-aqui.png`: logo principal.
- `CNAME`: dominio personalizado para GitHub Pages.
