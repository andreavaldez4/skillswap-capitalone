export type SwappyMessageType =
  | "tip"
  | "motivacion"
  | "bienvenida"
  | "logro"
  | "ayuda";

export interface SwappyMessage {
  type: SwappyMessageType;
  image: "idle" | "saludo" | "estudio";
  message: string;
}

export const SWAPPY_MESSAGES: Record<string, SwappyMessage[]> = {
  // Mensajes para la página de inicio
  inicio: [
    {
      type: "bienvenida",
      image: "saludo",
      message:
        "¡Hola! Soy Swappy, estoy aquí para ayudarte a intercambiar habilidades y crecer junto a otros.",
    },
    {
      type: "tip",
      image: "estudio",
      message:
        "Los usuarios que enseñan ganan el doble de Skill XP. ¡Comparte lo que sabes!",
    },
    {
      type: "motivacion",
      image: "saludo",
      message:
        "Cada habilidad que compartes es un regalo para alguien más. ¡Sigue así!",
    },
    {
      type: "tip",
      image: "idle",
      message: "Completa tu perfil al 100% para encontrar mejores matches.",
    },
  ],

  // Mensajes para la página de matches
  matches: [
    {
      type: "ayuda",
      image: "estudio",
      message:
        "Usa los filtros para encontrar personas con habilidades que te interesen.",
    },
    {
      type: "tip",
      image: "idle",
      message:
        "Envía solicitudes a personas que tengan estilos de aprendizaje compatibles contigo.",
    },
    {
      type: "motivacion",
      image: "saludo",
      message:
        "Cada conexión es una oportunidad de aprender algo nuevo. ¡Atrévete!",
    },
  ],

  // Mensajes para cuando no hay matches
  noMatches: [
    {
      type: "ayuda",
      image: "idle",
      message:
        "Aún no hay matches disponibles. Completa tu perfil y vuelve pronto.",
    },
    {
      type: "tip",
      image: "estudio",
      message:
        "Agrega más habilidades a tu perfil para aumentar tus posibilidades de match.",
    },
  ],

  // Mensajes para la página de mensajes
  mensajes: [
    {
      type: "ayuda",
      image: "idle",
      message:
        "Aquí aparecerán tus conversaciones cuando hagas match con alguien.",
    },
    {
      type: "tip",
      image: "estudio",
      message:
        "Recuerda coordinar horarios con tus matches para aprovechar al máximo el intercambio.",
    },
    {
      type: "motivacion",
      image: "saludo",
      message: "La comunicación es clave. ¡Sé amable y claro en tus mensajes!",
    },
  ],

  // Mensajes para comunidades
  comunidades: [
    {
      type: "ayuda",
      image: "saludo",
      message:
        "Las comunidades son geniales para aprender en grupo. ¡Únete a una!",
    },
    {
      type: "tip",
      image: "estudio",
      message:
        "En las comunidades puedes compartir recursos y aprender de varios expertos.",
    },
    {
      type: "motivacion",
      image: "idle",
      message: "El aprendizaje en comunidad es más divertido y enriquecedor.",
    },
  ],

  // Mensajes para onboarding
  onboarding: [
    {
      type: "bienvenida",
      image: "saludo",
      message:
        "¡Bienvenido a SkillSwap! Soy Swappy y te ayudaré en tu viaje de aprendizaje.",
    },
    {
      type: "ayuda",
      image: "estudio",
      message:
        "Completa este formulario para que pueda conectarte con personas compatibles.",
    },
    {
      type: "tip",
      image: "idle",
      message:
        "Sé específico con tus habilidades. Mientras más detalles, mejores matches.",
    },
  ],

  // Mensajes de logros
  logros: [
    {
      type: "logro",
      image: "saludo",
      message:
        "¡Felicidades! Has completado tu primer intercambio de habilidades.",
    },
    {
      type: "logro",
      image: "saludo",
      message: "¡Increíble! Has alcanzado un nuevo nivel de Skill XP.",
    },
    {
      type: "logro",
      image: "saludo",
      message: "¡Wow! Has hecho 5 matches exitosos. ¡Sigue así!",
    },
  ],

  // Mensajes motivacionales generales
  motivacion: [
    {
      type: "motivacion",
      image: "saludo",
      message:
        "Aprender algo nuevo cada día te acerca a tus metas. ¡No te rindas!",
    },
    {
      type: "motivacion",
      image: "estudio",
      message:
        "Enseñar es la mejor forma de aprender. ¡Comparte tu conocimiento!",
    },
    {
      type: "motivacion",
      image: "idle",
      message: "El crecimiento es un proceso. Celebra cada pequeño avance.",
    },
  ],
};

// Función para obtener un mensaje aleatorio de una categoría
export function getRandomSwappyMessage(
  category: keyof typeof SWAPPY_MESSAGES,
): SwappyMessage {
  const messages = SWAPPY_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Función para obtener un mensaje específico
export function getSwappyMessage(
  category: keyof typeof SWAPPY_MESSAGES,
  index: number = 0,
): SwappyMessage {
  const messages = SWAPPY_MESSAGES[category];
  return messages[index] || messages[0];
}
