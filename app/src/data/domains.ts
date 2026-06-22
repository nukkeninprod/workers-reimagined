import { Briefcase, Code2, BarChart2, Palette, Cloud, Megaphone, UtensilsCrossed, ShoppingBag, Package, Star, Heart, ClipboardList, Wrench } from 'lucide-react'

export const FLEXI_DOMAINS = [
  {
    label: 'Hospitality & Food',
    Icon: UtensilsCrossed,
    specialties: ['Waiter', 'Barista', 'Kitchen Assistant', 'Bar Staff', 'Catering Staff', 'Host / Hostess'],
  },
  {
    label: 'Retail & Sales',
    Icon: ShoppingBag,
    specialties: ['Sales Assistant', 'Cashier', 'Stock Clerk', 'Brand Ambassador', 'Fitting Room Attendant'],
  },
  {
    label: 'Events & Promotion',
    Icon: Star,
    specialties: ['Event Staff', 'Brand Promoter', 'Steward / Stewardess', 'Ticket Controller', 'Festival Worker'],
  },
  {
    label: 'Logistics & Warehouse',
    Icon: Package,
    specialties: ['Warehouse Worker', 'Picker-Packer', 'Delivery Driver', 'Moving Helper', 'Inventory Clerk'],
  },
  {
    label: 'Caretaking & Social',
    Icon: Heart,
    specialties: ['Babysitter', 'Senior Companion', 'Tutor', 'Youth Animator', 'Pet Sitter'],
  },
  {
    label: 'Admin & Office Support',
    Icon: ClipboardList,
    specialties: ['Receptionist', 'Data Entry Clerk', 'Administrative Assistant', 'Filing Clerk', 'Office Runner'],
  },
  {
    label: 'Facility & Cleaning',
    Icon: Wrench,
    specialties: ['Cleaner', 'Janitor', 'Handyman', 'Gardener', 'Maintenance Worker'],
  },
]

export const DOMAINS = [
  {
    label: 'Project Management & Coaching',
    Icon: Briefcase,
    specialties: ['Agile Coach', 'Digital Project Manager', 'IT Consultant', 'IT Project Manager', 'Mobile Project Manager', 'Product Executive', 'Product Manager', 'Scrum Master'],
  },
  {
    label: 'Software Development',
    Icon: Code2,
    specialties: ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Software Architect', 'QA Engineer'],
  },
  {
    label: 'Data & Analytics',
    Icon: BarChart2,
    specialties: ['BI Analyst', 'Data Analyst', 'Data Engineer', 'Data Scientist', 'ML Engineer'],
  },
  {
    label: 'Design & UX',
    Icon: Palette,
    specialties: ['Brand Designer', 'Motion Designer', 'Product Designer', 'UI Designer', 'UX Researcher'],
  },
  {
    label: 'Infrastructure & Cloud',
    Icon: Cloud,
    specialties: ['Cloud Architect', 'DevOps Engineer', 'Network Engineer', 'Security Engineer', 'SRE'],
  },
  {
    label: 'Marketing & Growth',
    Icon: Megaphone,
    specialties: ['Content Manager', 'Growth Hacker', 'SEO Specialist', 'Social Media Manager', 'Traffic Manager'],
  },
]

export const ALL_SPECIALTIES = [...FLEXI_DOMAINS, ...DOMAINS].flatMap(d => d.specialties)

export function getDomainsForCategory(category: 'student_flexi' | 'permanent_freelance' | null) {
  return category === 'student_flexi'
    ? [...FLEXI_DOMAINS, ...DOMAINS]
    : [...DOMAINS, ...FLEXI_DOMAINS]
}

export function findDomainForSpecialty(specialty: string, category?: 'student_flexi' | 'permanent_freelance' | null) {
  const pool = getDomainsForCategory(category ?? null)
  const lower = specialty.toLowerCase()
  return (
    pool.find(d => d.specialties.some(s => s.toLowerCase() === lower)) ??
    pool.find(d => d.specialties.some(s => lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower))) ??
    pool[0]
  )
}

export function resolveSpecialty(specialty: string): string {
  const lower = specialty.toLowerCase()
  const exact = ALL_SPECIALTIES.find(s => s.toLowerCase() === lower)
  if (exact) return exact
  const partial = ALL_SPECIALTIES.find(s => lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower))
  return partial ?? ''
}
