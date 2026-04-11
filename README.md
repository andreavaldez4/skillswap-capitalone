# SkillSwap

SkillSwap es una plataforma web para conectar personas que quieren intercambiar habilidades.
La idea central es simple: cada usuario puede ensenar lo que domina y aprender de otras personas de la comunidad.

## Proposito del producto

SkillSwap busca resolver un problema comun: muchas personas quieren aprender algo nuevo, pero no siempre tienen acceso a clases formales o costosas.

Con SkillSwap, el aprendizaje se vuelve colaborativo y accesible:

- Cada persona crea su perfil con intereses y preferencias.
- Cada persona define que quiere aprender y que puede ensenar.
- El sistema permite encontrar matches por afinidad de habilidades.
- Se organiza la disponibilidad por franjas horarias semanales para facilitar sesiones reales.

## Contexto: Capital One Day Challenge

Este proyecto fue desarrollado como parte del Capital One Day Challenge.
El objetivo del challenge fue construir un producto funcional de principio a fin en un tiempo limitado, demostrando:

- Capacidad de ideacion y ejecucion rapida.
- Diseno centrado en el usuario.
- Implementacion tecnica full-stack.
- Colaboracion de equipo bajo presion de tiempo.

En ese contexto, SkillSwap se planteo como un MVP claro, util y demostrable en poco tiempo.

## Lo que implementamos

Durante el desarrollo se completaron estas piezas principales del MVP:

- Flujo de autenticacion con rutas separadas para login, signup y pantalla de exito.
- Wizard de registro en 3 pasos.
- Seleccion multiple de intereses y preferencias.
- Campos personalizados tipo "Otro" que se agregan como chips a cada lista (permitiendo multiples valores personalizados).
- Calendario semanal de disponibilidad estilo grid con seleccion por arrastre (drag-select).
- Persistencia de usuarios y preferencias en JSON via endpoints API.
- Ajuste visual consistente con el resto del producto (paleta naranja, tarjetas claras, textos en espanol).

## Stack tecnico

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + componentes UI
- API Routes en Next.js
- Persistencia local en JSON para el MVP

## Como ejecutar el proyecto
Estar en branch dev para ejecutar última actualización del proyecto

```bash
npm install
npm run dev
```

Abrir en navegador:

- http://localhost:3000

## Estado actual

SkillSwap se encuentra en estado MVP funcional para demo del challenge:

- Flujo principal completo de registro y preferencias.
- Login funcional contra datos persistidos.
- Base lista para evolucionar a backend y base de datos productiva.

## Uso de la Inteligencia Artificial en el desarrollo del Proyecto

Para acelerar el proceso de prototipado y desarrollo utilizamos Claude y GitHub Copilot como asistentes de IA.

Su aporte estuvo enfocado en:

- Generar plantillas iniciales de vistas y componentes.
- Proponer estructuras de formularios multi-step.
- Ayudar a iterar rapidamente estilos y copy de interfaz.
- Sugerir refactors y validaciones para mantener consistencia.
- Reducir tiempo en tareas repetitivas para enfocarnos en decisiones de producto.

Importante: las decisiones de arquitectura, alcance y experiencia final fueron definidas y validadas por el equipo.
