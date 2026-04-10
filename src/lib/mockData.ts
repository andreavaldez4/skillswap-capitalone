// Datos mock hardcodeados para Skill Swap

export type Skill = {
  id: string;
  name: string;
  category: 'languages' | 'tech' | 'arts' | 'wellness' | 'other';
};

export type User = {
  id: string;
  name: string;
  location: string;
  isRemote: boolean;
  skillsToTeach: Skill[];
  skillsToLearn: Skill[];
  xp: number;
  bio: string;
  availability: {
    day: 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';
    time: 'Mañana' | 'Tarde' | 'Noche';
  }[];
};

export type Community = {
  id: string;
  name: string;
  type: 'learning' | 'teaching';
  members: number;
  description: string;
  skill: Skill;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  groupName?: string;
  lastMessage?: Message;
};

// Habilidades disponibles
export const SKILLS: Skill[] = [
  { id: 'guitar', name: 'Guitarra', category: 'arts' },
  { id: 'programming', name: 'Programación', category: 'tech' },
  { id: 'cooking', name: 'Cocina', category: 'other' },
  { id: 'spanish', name: 'Español', category: 'languages' },
  { id: 'photography', name: 'Fotografía', category: 'arts' },
  { id: 'yoga', name: 'Yoga', category: 'wellness' },
  { id: 'design', name: 'Diseño', category: 'arts' },
  { id: 'english', name: 'Inglés', category: 'languages' },
  { id: 'chess', name: 'Ajedrez', category: 'other' },
  { id: 'drawing', name: 'Dibujo', category: 'arts' },
  { id: 'python', name: 'Python', category: 'tech' },
  { id: 'french', name: 'Francés', category: 'languages' },
  { id: 'portuguese', name: 'Portugués', category: 'languages' },
  { id: 'italian', name: 'Italiano', category: 'languages' },
  { id: 'japanese', name: 'Japonés', category: 'languages' },
];

// Usuarios mock
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Martínez',
    location: 'Madrid',
    isRemote: true,
    skillsToTeach: [SKILLS[0], SKILLS[4]], // Guitarra, Fotografía
    skillsToLearn: [SKILLS[1], SKILLS[10]], // Programación, Python
    xp: 450,
    bio: 'Me encanta enseñar guitarra y aprender sobre tecnología.',
    availability: [
      { day: 'Lun', time: 'Tarde' },
      { day: 'Mié', time: 'Noche' },
      { day: 'Sáb', time: 'Mañana' },
    ],
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    location: 'Barcelona',
    isRemote: false,
    skillsToTeach: [SKILLS[1], SKILLS[10]], // Programación, Python
    skillsToLearn: [SKILLS[7], SKILLS[11]], // Inglés, Francés
    xp: 820,
    bio: 'Desarrollador con 5 años de experiencia. Busco practicar idiomas.',
    availability: [
      { day: 'Mar', time: 'Noche' },
      { day: 'Jue', time: 'Noche' },
      { day: 'Vie', time: 'Tarde' },
    ],
  },
  {
    id: '3',
    name: 'Laura Gómez',
    location: 'Valencia',
    isRemote: true,
    skillsToTeach: [SKILLS[5], SKILLS[2]], // Yoga, Cocina
    skillsToLearn: [SKILLS[4], SKILLS[6]], // Fotografía, Diseño
    xp: 230,
    bio: 'Profesora de yoga certificada. Me fascina el arte visual.',
    availability: [
      { day: 'Lun', time: 'Mañana' },
      { day: 'Mié', time: 'Mañana' },
      { day: 'Vie', time: 'Mañana' },
    ],
  },
  {
    id: '4',
    name: 'Diego Fernández',
    location: 'Sevilla',
    isRemote: false,
    skillsToTeach: [SKILLS[7], SKILLS[11]], // Inglés, Francés
    skillsToLearn: [SKILLS[0], SKILLS[8]], // Guitarra, Ajedrez
    xp: 1250,
    bio: 'Políglota apasionado por la música y los juegos de estrategia.',
    availability: [
      { day: 'Mar', time: 'Tarde' },
      { day: 'Jue', time: 'Tarde' },
      { day: 'Sáb', time: 'Tarde' },
    ],
  },
  {
    id: '5',
    name: 'Elena Sánchez',
    location: 'Bilbao',
    isRemote: true,
    skillsToTeach: [SKILLS[6], SKILLS[9]], // Diseño, Dibujo
    skillsToLearn: [SKILLS[1], SKILLS[5]], // Programación, Yoga
    xp: 580,
    bio: 'Diseñadora gráfica freelance. Quiero equilibrar trabajo y bienestar.',
    availability: [
      { day: 'Lun', time: 'Noche' },
      { day: 'Mié', time: 'Tarde' },
      { day: 'Vie', time: 'Noche' },
    ],
  },
  {
    id: '6',
    name: 'Javier López',
    location: 'Málaga',
    isRemote: true,
    skillsToTeach: [SKILLS[8], SKILLS[3]], // Ajedrez, Español
    skillsToLearn: [SKILLS[7], SKILLS[12]], // Inglés, Portugués
    xp: 95,
    bio: 'Maestro de ajedrez amateur. Busco mejorar mis idiomas.',
    availability: [
      { day: 'Mar', time: 'Mañana' },
      { day: 'Jue', time: 'Mañana' },
      { day: 'Sáb', time: 'Noche' },
    ],
  },
  {
    id: '7',
    name: 'Sofía Torres',
    location: 'Granada',
    isRemote: false,
    skillsToTeach: [SKILLS[2], SKILLS[3]], // Cocina, Español
    skillsToLearn: [SKILLS[13], SKILLS[14]], // Italiano, Japonés
    xp: 340,
    bio: 'Chef en formación. Me encantan las culturas diferentes.',
    availability: [
      { day: 'Lun', time: 'Tarde' },
      { day: 'Mié', time: 'Noche' },
      { day: 'Dom', time: 'Mañana' },
    ],
  },
  {
    id: '8',
    name: 'Miguel Ángel Castro',
    location: 'Zaragoza',
    isRemote: true,
    skillsToTeach: [SKILLS[4], SKILLS[9]], // Fotografía, Dibujo
    skillsToLearn: [SKILLS[6], SKILLS[2]], // Diseño, Cocina
    xp: 1890,
    bio: 'Fotógrafo profesional. Siempre aprendiendo algo nuevo.',
    availability: [
      { day: 'Mar', time: 'Tarde' },
      { day: 'Jue', time: 'Tarde' },
      { day: 'Vie', time: 'Tarde' },
    ],
  },
  {
    id: '9',
    name: 'Isabel Moreno',
    location: 'Murcia',
    isRemote: true,
    skillsToTeach: [SKILLS[11], SKILLS[13]], // Francés, Italiano
    skillsToLearn: [SKILLS[5], SKILLS[4]], // Yoga, Fotografía
    xp: 670,
    bio: 'Traductora freelance. Busco equilibrio entre mente y cuerpo.',
    availability: [
      { day: 'Lun', time: 'Mañana' },
      { day: 'Mié', time: 'Mañana' },
      { day: 'Vie', time: 'Mañana' },
    ],
  },
  {
    id: '10',
    name: 'Roberto Jiménez',
    location: 'Pamplona',
    isRemote: false,
    skillsToTeach: [SKILLS[1], SKILLS[6]], // Programación, Diseño
    skillsToLearn: [SKILLS[0], SKILLS[8]], // Guitarra, Ajedrez
    xp: 2100,
    bio: 'Desarrollador senior y diseñador UX. Aficionado a la música.',
    availability: [
      { day: 'Lun', time: 'Noche' },
      { day: 'Mar', time: 'Noche' },
      { day: 'Jue', time: 'Noche' },
    ],
  },
];

// Usuario actual (mock)
export const CURRENT_USER: User = {
  id: 'current',
  name: 'Tú',
  location: 'Madrid',
  isRemote: true,
  skillsToTeach: [SKILLS[1], SKILLS[6]], // Programación, Diseño
  skillsToLearn: [SKILLS[0], SKILLS[11]], // Guitarra, Francés
  xp: 230,
  bio: 'Apasionado por aprender y enseñar.',
  availability: [
    { day: 'Lun', time: 'Tarde' },
    { day: 'Mié', time: 'Noche' },
    { day: 'Sáb', time: 'Mañana' },
  ],
};

// Comunidades mock
export const MOCK_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Aprender Francés',
    type: 'learning',
    members: 127,
    description: 'Practica francés con hablantes nativos y otros estudiantes.',
    skill: SKILLS[11],
  },
  {
    id: '2',
    name: 'Guitarra para Principiantes',
    type: 'learning',
    members: 89,
    description: 'Aprende los fundamentos de la guitarra desde cero.',
    skill: SKILLS[0],
  },
  {
    id: '3',
    name: 'Introducción a Python',
    type: 'learning',
    members: 234,
    description: 'Curso básico de Python para principiantes.',
    skill: SKILLS[10],
  },
  {
    id: '4',
    name: 'Yoga para Todos',
    type: 'learning',
    members: 156,
    description: 'Sesiones de yoga para todos los niveles.',
    skill: SKILLS[5],
  },
  {
    id: '5',
    name: 'Fotografía Básica',
    type: 'learning',
    members: 98,
    description: 'Aprende técnicas básicas de fotografía.',
    skill: SKILLS[4],
  },
  {
    id: '6',
    name: 'Enseña Inglés',
    type: 'teaching',
    members: 67,
    description: 'Comparte tu conocimiento de inglés con otros.',
    skill: SKILLS[7],
  },
  {
    id: '7',
    name: 'Comparte tu Cocina',
    type: 'teaching',
    members: 45,
    description: 'Enseña tus recetas favoritas a la comunidad.',
    skill: SKILLS[2],
  },
  {
    id: '8',
    name: 'Mentores de Diseño',
    type: 'teaching',
    members: 78,
    description: 'Ayuda a otros a mejorar sus habilidades de diseño.',
    skill: SKILLS[6],
  },
];

// Mensajes mock
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [CURRENT_USER, MOCK_USERS[0]],
    isGroup: false,
    messages: [
      {
        id: 'm1',
        senderId: MOCK_USERS[0].id,
        content: 'Hola! Vi que quieres aprender guitarra. Puedo ayudarte.',
        timestamp: new Date('2026-04-08T10:30:00'),
      },
      {
        id: 'm2',
        senderId: CURRENT_USER.id,
        content: 'Genial! Me encantaría. ¿Cuándo podemos empezar?',
        timestamp: new Date('2026-04-08T10:35:00'),
      },
      {
        id: 'm3',
        senderId: MOCK_USERS[0].id,
        content: 'Qué te parece el sábado por la mañana?',
        timestamp: new Date('2026-04-08T10:40:00'),
      },
      {
        id: 'm4',
        senderId: CURRENT_USER.id,
        content: 'Perfecto! Nos vemos entonces.',
        timestamp: new Date('2026-04-08T10:42:00'),
      },
    ],
  },
  {
    id: '2',
    participants: [CURRENT_USER, MOCK_USERS[1]],
    isGroup: false,
    messages: [
      {
        id: 'm5',
        senderId: CURRENT_USER.id,
        content: 'Hola Carlos! Vi que enseñas Python.',
        timestamp: new Date('2026-04-09T15:20:00'),
      },
      {
        id: 'm6',
        senderId: MOCK_USERS[1].id,
        content: 'Sí! Con mucho gusto te ayudo. ¿Qué nivel tienes?',
        timestamp: new Date('2026-04-09T15:25:00'),
      },
      {
        id: 'm7',
        senderId: CURRENT_USER.id,
        content: 'Soy principiante. Quiero aprender desde cero.',
        timestamp: new Date('2026-04-09T15:30:00'),
      },
    ],
  },
  {
    id: '3',
    participants: [CURRENT_USER, MOCK_USERS[3], MOCK_USERS[8]],
    isGroup: true,
    groupName: 'Guitarristas',
    messages: [
      {
        id: 'm8',
        senderId: MOCK_USERS[3].id,
        content: 'Alguien quiere practicar este fin de semana?',
        timestamp: new Date('2026-04-09T18:00:00'),
      },
      {
        id: 'm9',
        senderId: MOCK_USERS[8].id,
        content: 'Yo me apunto!',
        timestamp: new Date('2026-04-09T18:05:00'),
      },
      {
        id: 'm10',
        senderId: CURRENT_USER.id,
        content: 'Cuenta conmigo también.',
        timestamp: new Date('2026-04-09T18:10:00'),
      },
    ],
  },
  {
    id: '4',
    participants: [CURRENT_USER, MOCK_USERS[1], MOCK_USERS[4], MOCK_USERS[9]],
    isGroup: true,
    groupName: 'Python Principiantes',
    messages: [
      {
        id: 'm11',
        senderId: MOCK_USERS[1].id,
        content: 'Hola a todos! Bienvenidos al grupo de Python.',
        timestamp: new Date('2026-04-07T09:00:00'),
      },
      {
        id: 'm12',
        senderId: MOCK_USERS[4].id,
        content: 'Gracias! Emocionada por aprender.',
        timestamp: new Date('2026-04-07T09:15:00'),
      },
    ],
  },
  {
    id: '5',
    participants: [CURRENT_USER, MOCK_USERS[8], MOCK_USERS[6]],
    isGroup: true,
    groupName: 'Francés Juntos',
    messages: [
      {
        id: 'm13',
        senderId: MOCK_USERS[8].id,
        content: 'Bonjour! Comment ça va?',
        timestamp: new Date('2026-04-06T14:00:00'),
      },
      {
        id: 'm14',
        senderId: MOCK_USERS[6].id,
        content: 'Très bien, merci!',
        timestamp: new Date('2026-04-06T14:05:00'),
      },
    ],
  },
];

// Asignar último mensaje a cada conversación
MOCK_CONVERSATIONS.forEach((conv) => {
  if (conv.messages.length > 0) {
    conv.lastMessage = conv.messages[conv.messages.length - 1];
  }
});
