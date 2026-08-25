import type { LookupOption, PoojaCategory, Zone } from '../types';

/**
 * The Sankalpam pooja catalog.
 *
 * Items 1–8 are confirmed from the existing Sankalpam backend. Items 9–16 are
 * PROVISIONAL — the Onboarding Guide references "the 16 poojas in the Sankalpam
 * catalog (see Annexure A)" but Annexure A was not supplied. They are marked
 * `provisional` so they are trivially replaceable when the real list arrives.
 *
 * Prices are platform-fixed. Pujaris never set or negotiate them.
 */
export const POOJAS: PoojaCategory[] = [
  {
    id: 'griha_pravesh',
    name: 'Griha Pravesh',
    teluguName: 'గృహ ప్రవేశం',
    category: 'house',
    price: 5100,
    durationMinutes: 180,
    serviceTypes: ['home_visit'],
    summary: 'House-warming ceremony to bless a new home before the family moves in.',
    pujariBrings: ['Panchapatra & udharini', 'Personal ritual texts', 'Sacred thread', 'Bell'],
    devoteeProvides: [
      'Samagri kit (Griha Pravesh)',
      'Kalasham & coconut',
      'Mango leaves',
      'Milk for boiling ceremony',
      'Turmeric & kumkum',
    ],
    requiresGotra: true,
  },
  {
    id: 'satyanarayana',
    name: 'Satyanarayana Vratam',
    teluguName: 'సత్యనారాయణ వ్రతం',
    category: 'deity',
    price: 3100,
    durationMinutes: 150,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Vrat katha and pooja performed for prosperity, gratitude, and family wellbeing.',
    pujariBrings: ['Vrata katha text', 'Panchapatra & udharini', 'Bell'],
    devoteeProvides: ['Samagri kit (Satyanarayana)', 'Banana leaves', 'Prasadam ingredients', 'Flowers'],
    requiresGotra: true,
  },
  {
    id: 'ganapati',
    name: 'Ganapati Pooja',
    teluguName: 'గణపతి పూజ',
    category: 'deity',
    price: 2100,
    durationMinutes: 90,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Invocation of Lord Ganesha before any auspicious beginning.',
    pujariBrings: ['Panchapatra & udharini', 'Personal ritual texts'],
    devoteeProvides: ['Samagri kit (Ganapati)', 'Durva grass', 'Modak or jaggery', 'Flowers'],
    requiresGotra: true,
  },
  {
    id: 'rudrabhishekam',
    name: 'Rudrabhishekam',
    teluguName: 'రుద్రాభిషేకం',
    category: 'deity',
    price: 4100,
    durationMinutes: 150,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Abhishekam to Lord Shiva with Rudram chanting for health and longevity.',
    pujariBrings: ['Rudram text', 'Panchapatra & udharini', 'Bell'],
    devoteeProvides: ['Samagri kit (Rudrabhishekam)', 'Milk, curd, honey, ghee', 'Bilva leaves', 'Shivalinga (if available)'],
    requiresGotra: true,
  },
  {
    id: 'durga',
    name: 'Durga Pooja',
    teluguName: 'దుర్గా పూజ',
    category: 'deity',
    price: 3500,
    durationMinutes: 150,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Devotion to Maa Durga for strength, protection, and resolution of difficulties.',
    pujariBrings: ['Devi stotram texts', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Durga)', 'Red flowers', 'Kumkum', 'Prasadam ingredients'],
    requiresGotra: true,
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Pooja',
    teluguName: 'లక్ష్మీ పూజ',
    category: 'deity',
    price: 2700,
    durationMinutes: 120,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Invocation of Goddess Lakshmi for abundance and household prosperity.',
    pujariBrings: ['Lakshmi ashtottaram text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Lakshmi)', 'Lotus or red flowers', 'Rice & coins', 'Ghee lamp'],
    requiresGotra: true,
  },
  {
    id: 'saraswati',
    name: 'Saraswati Pooja',
    teluguName: 'సరస్వతీ పూజ',
    category: 'deity',
    price: 2500,
    durationMinutes: 105,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Blessings of Goddess Saraswati for learning, wisdom, and the arts.',
    pujariBrings: ['Saraswati stotram text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Saraswati)', 'White flowers', 'Books or instruments for blessing'],
    requiresGotra: true,
  },
  {
    id: 'guru_datta',
    name: 'Guru Datta Pooja',
    teluguName: 'గురు దత్త పూజ',
    category: 'deity',
    price: 2700,
    durationMinutes: 120,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Honouring Lord Dattatreya for spiritual guidance and clarity.',
    pujariBrings: ['Datta stotram text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Datta)', 'Flowers', 'Ghee lamp'],
    requiresGotra: true,
  },

  // ---- Provisional beyond this point — pending Annexure A -------------------
  {
    id: 'navagraha_shanti',
    name: 'Navagraha Shanti',
    teluguName: 'నవగ్రహ శాంతి',
    category: 'dosha',
    price: 4500,
    durationMinutes: 180,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Propitiation of the nine planets to reduce adverse planetary influence.',
    pujariBrings: ['Navagraha mantra text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Navagraha)', 'Nine grains', 'Nine cloth pieces', 'Sesame oil'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'sudarshana_homam',
    name: 'Sudarshana Homam',
    teluguName: 'సుదర్శన హోమం',
    category: 'homam',
    price: 6500,
    durationMinutes: 210,
    serviceTypes: ['home_visit'],
    summary: 'Fire ritual invoking Sudarshana for protection and removal of obstacles.',
    pujariBrings: ['Homam mantra texts', 'Sruk & sruva', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Homam)', 'Havan kund', 'Firewood & ghee', 'Open or ventilated space'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'ayushya_homam',
    name: 'Ayushya Homam',
    teluguName: 'ఆయుష్య హోమం',
    category: 'homam',
    price: 5500,
    durationMinutes: 180,
    serviceTypes: ['home_visit'],
    summary: 'Fire ritual for longevity and wellbeing, commonly performed on birthdays.',
    pujariBrings: ['Homam mantra texts', 'Sruk & sruva'],
    devoteeProvides: ['Samagri kit (Homam)', 'Havan kund', 'Firewood & ghee', 'Durva grass'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'namakaranam',
    name: 'Namakaranam',
    teluguName: 'నామకరణం',
    category: 'life_event',
    price: 3100,
    durationMinutes: 105,
    serviceTypes: ['home_visit'],
    summary: 'Naming ceremony performed for a newborn child.',
    pujariBrings: ['Samskara text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Samskara)', 'Cradle & new clothes', 'Honey & gold item', 'Rice for name writing'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'annaprasana',
    name: 'Annaprasana',
    teluguName: 'అన్నప్రాశన',
    category: 'life_event',
    price: 3100,
    durationMinutes: 90,
    serviceTypes: ['home_visit'],
    summary: 'First-rice ceremony marking a child’s introduction to solid food.',
    pujariBrings: ['Samskara text', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Samskara)', 'Cooked rice & payasam', 'Silver spoon & bowl', 'New clothes'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'aksharabhyasam',
    name: 'Aksharabhyasam',
    teluguName: 'అక్షరాభ్యాసం',
    category: 'life_event',
    price: 2700,
    durationMinutes: 90,
    serviceTypes: ['home_visit'],
    summary: 'Initiation into learning, invoking Saraswati and Ganapati for the child.',
    pujariBrings: ['Saraswati & Ganapati texts', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Aksharabhyasam)', 'Rice tray', 'Slate & chalk', 'New clothes'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'upanayanam',
    name: 'Upanayanam',
    teluguName: 'ఉపనయనం',
    category: 'life_event',
    price: 8500,
    durationMinutes: 300,
    serviceTypes: ['home_visit'],
    summary: 'Sacred-thread ceremony marking the start of formal Vedic study.',
    pujariBrings: ['Samskara & Gayatri texts', 'Sruk & sruva', 'Panchapatra & udharini'],
    devoteeProvides: ['Samagri kit (Upanayanam)', 'Havan kund', 'Yajnopavitam', 'Traditional attire', 'Open or ventilated space'],
    requiresGotra: true,
    provisional: true,
  },
  {
    id: 'pitru_karma',
    name: 'Shraddha / Pitru Karma',
    teluguName: 'శ్రాద్ధ కర్మ',
    category: 'ancestral',
    price: 3500,
    durationMinutes: 150,
    serviceTypes: ['home_visit', 'remote'],
    summary: 'Rites performed in remembrance of ancestors on the annual observance.',
    pujariBrings: ['Shraddha vidhi text', 'Panchapatra & udharini', 'Darbha grass'],
    devoteeProvides: ['Samagri kit (Shraddha)', 'Cooked offerings', 'Sesame seeds', 'Banana leaves'],
    requiresGotra: true,
    provisional: true,
  },
];

export const poojaById = (id: string) => POOJAS.find((p) => p.id === id);

export const CATEGORY_LABEL: Record<PoojaCategory['category'], string> = {
  house: 'House ceremonies',
  deity: 'Deity poojas',
  homam: 'Homams',
  life_event: 'Life events',
  dosha: 'Dosha parihara',
  ancestral: 'Ancestral rites',
};

/** Hyderabad, two zones — per the Onboarding Guide §5. */
export const ZONES: Zone[] = [
  {
    id: 'zone_a',
    name: 'Zone A — West Hyderabad',
    localities: [
      'Gachibowli',
      'Kondapur',
      'Madhapur',
      'Kukatpally',
      'Miyapur',
      'Manikonda',
      'Nallagandla',
    ],
  },
  {
    id: 'zone_b',
    name: 'Zone B — Central & East Hyderabad',
    localities: [
      'Banjara Hills',
      'Jubilee Hills',
      'Secunderabad',
      'Begumpet',
      'Himayatnagar',
      'Uppal',
      'LB Nagar',
    ],
  },
];

export const zoneById = (id?: string) => ZONES.find((z) => z.id === id);

export const LANGUAGES: LookupOption[] = [
  { id: 'telugu', label: 'Telugu' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'sanskrit', label: 'Sanskrit' },
  { id: 'english', label: 'English' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'kannada', label: 'Kannada' },
  { id: 'marathi', label: 'Marathi' },
];

export const VEDAS: LookupOption[] = [
  { id: 'rigveda', label: 'Rigveda' },
  { id: 'shukla_yajurveda', label: 'Shukla Yajurveda' },
  { id: 'krishna_yajurveda', label: 'Krishna Yajurveda' },
  { id: 'samaveda', label: 'Samaveda' },
  { id: 'atharvaveda', label: 'Atharvaveda' },
];

export const SAMPRADAYA: LookupOption[] = [
  { id: 'smarta', label: 'Smarta' },
  { id: 'vaishnava', label: 'Vaishnava' },
  { id: 'shaiva', label: 'Shaiva' },
  { id: 'madhwa', label: 'Madhwa' },
  { id: 'sri_vaishnava', label: 'Sri Vaishnava' },
];

export const TRAINING_TYPES: LookupOption[] = [
  { id: 'guru_shishya', label: 'Guru-shishya training' },
  { id: 'pathshala', label: 'Vedic pathshala' },
  { id: 'temple', label: 'Temple experience' },
  { id: 'family', label: 'Family lineage' },
];

/** Respectful, closed set — declining is legitimate professional judgement. */
export const DECLINE_REASONS: LookupOption[] = [
  { id: 'unavailable', label: 'Not available at that time' },
  { id: 'distance', label: 'Too far from my area' },
  { id: 'not_offered', label: "I don't perform this pooja" },
  { id: 'personal', label: 'Personal or family reason' },
  { id: 'other', label: 'Other' },
];

export const CANCEL_REASONS: LookupOption[] = [
  { id: 'emergency', label: 'Family emergency' },
  { id: 'illness', label: 'Illness' },
  { id: 'double_booked', label: 'Double-booked' },
  { id: 'unsafe', label: 'Unsafe or inappropriate location' },
  { id: 'other', label: 'Other' },
];

/** Typing is minimised everywhere — chat leads with these. */
export const QUICK_REPLIES = [
  "I'm on my way.",
  'Running about 15 minutes late.',
  'Please keep the samagri ready.',
  'Which floor is the flat on?',
  'Is parking available nearby?',
  'Please confirm the gotra.',
];

export const PRE_ACCEPT_QUESTIONS = [
  'Is the samagri kit already delivered?',
  'Can you confirm the exact address?',
  'Which family members will attend?',
  'Is there parking available?',
];

export const COMMISSION_RATE = 0.15;
