export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  degree: "B.Tech" | "M.Tech" | "MBA";
  duration: string;
  seats: number;
  annualFee: string;
  description: string;
  eligibility: string;
  highlights: readonly string[];
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  role: string;
  batchOrDept: string;
  avatar: string;
}

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  specialization: string;
  image: string;
}

export interface CampusFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface Recruiter {
  name: string;
  category: string;
  highestOffer?: string;
}

export interface DeptPlacement {
  department: string;
  placementRate: string;
  averagePackage: string;
  highestPackage: string;
}

export const siteConfig = {
  name: "EduReach",
  fullName: "EduReach College of Engineering & Management",
  tagline: "Your Gateway to Smarter Education Decisions",
  established: "Est. 2005",
  location: "Hyderabad, Telangana",
  campusSize: "25 Acres",
  accreditation: "NAAC A++ Accredited · NBA Approved · Affiliated to JNTUH",
  counselorName: "Ava",
  counselorRole: "EduReach AI Counselor",
  primaryColor: "#7B1E2B",
  creamColor: "#FAF7F5",
} as const;

export const images = {
  campusHero:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80",
  campusAerial:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  digitalLibrary:
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  techLab:
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80",
  studentLife:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  sportsComplex:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  mentors: {
    drSharma:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    drReddy:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    drKulkarni:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    profRao:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  quotes: {
    alumni1:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    student1:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    recruiter1:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
} as const;

export const navLinks: readonly NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Courses", href: "#courses" },
  { label: "Quotes", href: "#quotes" },
  { label: "Mentors", href: "#mentors" },
] as const;

export const contactInfo = {
  phone: "+91 9876543210",
  email: "admissions@edureach.edu",
  generalEmail: "info@edureach.edu",
  address: "EduReach Campus, Knowledge City, Gachibowli, Hyderabad - 500081, Telangana, India",
  officeHours: "Monday – Saturday: 9:00 AM – 5:00 PM IST",
} as const;

export const aboutContent = {
  title: "Empowering Minds, Shaping Tomorrow",
  subtitle: "Excellence in Technology, Research & Leadership since 2005",
  overview:
    "Founded in 2005 in Hyderabad, EduReach College stands as a premier institution dedicated to academic rigor, experiential learning, and futuristic industry alignment. Spanning over 25 lush green acres, our world-class campus nurtures next-generation engineers, technologists, and visionary business leaders.",
  vision:
    "To be a globally recognized center of excellence in education, pioneering research, and inclusive technological advancement.",
  mission:
    "Delivering value-driven, multi-disciplinary technical education with strong ethical foundations, industry integration, and continuous innovation.",
  stats: [
    {
      value: "Est. 2005",
      label: "Legacy of Excellence",
      description: "20+ years of educational impact",
    },
    { value: "25 Acres", label: "Lush Campus", description: "Modern eco-friendly infrastructure" },
    {
      value: "150+",
      label: "Distinguished Faculty",
      description: "80% holding PhD or doctoral degrees",
    },
    {
      value: "15:1",
      label: "Student-Faculty Ratio",
      description: "Personalized mentorship and guidance",
    },
    {
      value: "10,000+",
      label: "Alumni Network",
      description: "Thriving worldwide in Fortune 500 firms",
    },
  ],
} as const;

export const achievementsContent = {
  title: "Rankings & Institutional Milestones",
  subtitle: "Recognized nationally for academic rigor, research outcomes, and placement success",
  highlights: [
    {
      title: "92% Placement Rate",
      description: "Consistent placement track record over the last 5 consecutive academic years.",
      metric: "92%",
    },
    {
      title: "₹42 LPA Highest CTC",
      description: "Secured by Computer Science students at global tech giants like Google.",
      metric: "₹42 LPA",
    },
    {
      title: "NAAC A++ Accredited",
      description:
        "Highest institutional rating awarded by the National Assessment and Accreditation Council.",
      metric: "Grade A++",
    },
    {
      title: "150+ Research Papers",
      description: "Published annually in peer-reviewed IEEE, ACM, Springer, and Scopus journals.",
      metric: "150+ / Yr",
    },
  ],
} as const;

export const coursesContent: readonly Course[] = [
  // B.Tech Programs
  {
    id: "btech-cse",
    name: "Computer Science & Engineering",
    code: "CSE",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 180,
    annualFee: "₹1,50,000",
    description:
      "Comprehensive program covering algorithms, cloud computing, cybersecurity, distributed systems, and modern software engineering practices.",
    eligibility: "10+2 with Physics, Mathematics & Chemistry (Min 60%) + TS/AP EAMCET or JEE Main.",
    highlights: ["Industry Lab by Microsoft", "Average CTC: 10.2 LPA", "100% Internship Placement"],
  },
  {
    id: "btech-aids",
    name: "Artificial Intelligence & Data Science",
    code: "AI&DS",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 120,
    annualFee: "₹1,50,000",
    description:
      "Deep focus on machine learning algorithms, deep learning, NLP, computer vision, data engineering, and generative AI systems.",
    eligibility: "10+2 with Physics, Mathematics & Chemistry (Min 60%) + TS/AP EAMCET or JEE Main.",
    highlights: ["NVIDIA GPU Compute Cluster", "AI Research Lab", "Average CTC: 9.8 LPA"],
  },
  {
    id: "btech-ece",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 120,
    annualFee: "₹1,50,000",
    description:
      "Hands-on study of VLSI design, embedded systems, IoT architecture, signal processing, and high-frequency wireless communications.",
    eligibility: "10+2 with PCM (Min 60%) + TS/AP EAMCET.",
    highlights: ["Cadence & Synopsys EDA Tools", "IoT Prototyping Hub", "Average CTC: 8.4 LPA"],
  },
  {
    id: "btech-it",
    name: "Information Technology",
    code: "IT",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    annualFee: "₹1,50,000",
    description:
      "Specialized in enterprise software development, database administration, information security, and cloud DevOps engineering.",
    eligibility: "10+2 with PCM (Min 60%) + TS/AP EAMCET.",
    highlights: ["AWS & Azure Cloud Tracks", "Cyber Security Cell", "Average CTC: 8.9 LPA"],
  },
  {
    id: "btech-me",
    name: "Mechanical Engineering",
    code: "ME",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    annualFee: "₹1,50,000",
    description:
      "Thermodynamics, robotics, mechatronics, CAD/CAM computational design, and electric vehicle (EV) automotive technologies.",
    eligibility: "10+2 with PCM (Min 60%) + TS/AP EAMCET.",
    highlights: ["Robotics & Automation Lab", "Formula Student Club", "Average CTC: 6.8 LPA"],
  },
  {
    id: "btech-ce",
    name: "Civil Engineering",
    code: "CE",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    annualFee: "₹1,50,000",
    description:
      "Structural analysis, smart green city infrastructure, geotechnical engineering, surveying with GIS, and construction management.",
    eligibility: "10+2 with PCM (Min 60%) + TS/AP EAMCET.",
    highlights: ["BIM & Smart City Software", "Concrete Testing Lab", "Average CTC: 6.5 LPA"],
  },

  // M.Tech Programs
  {
    id: "mtech-cs",
    name: "Computer Science",
    code: "M.Tech CS",
    degree: "M.Tech",
    duration: "2 Years (4 Semesters)",
    seats: 30,
    annualFee: "₹1,00,000",
    description:
      "Advanced postgraduate studies in distributed algorithms, high-performance computing, cryptography, and intelligent autonomous systems.",
    eligibility: "B.Tech in CSE/IT or equivalent (Min 55%) + GATE / TS PGECET.",
    highlights: [
      "Sponsored Research Projects",
      "Doctoral Track Pathway",
      "Stipend for GATE Scholars",
    ],
  },
  {
    id: "mtech-vlsi",
    name: "VLSI Design & Embedded Systems",
    code: "M.Tech VLSI",
    degree: "M.Tech",
    duration: "2 Years (4 Semesters)",
    seats: 24,
    annualFee: "₹1,00,000",
    description:
      "ASIC design, FPGA prototyping, analog & mixed-signal verification, and system-on-chip (SoC) architectures.",
    eligibility: "B.Tech in ECE/EEE or equivalent (Min 55%) + GATE / TS PGECET.",
    highlights: [
      "Cleanroom Access",
      "Industry Tie-ups with Semiconductor Firms",
      "Average CTC: 11.5 LPA",
    ],
  },
  {
    id: "mtech-structural",
    name: "Structural Engineering",
    code: "M.Tech SE",
    degree: "M.Tech",
    duration: "2 Years (4 Semesters)",
    seats: 30,
    annualFee: "₹1,00,000",
    description:
      "Earthquake-resistant design, finite element analysis, high-rise building dynamics, and sustainable structural composites.",
    eligibility: "B.Tech in Civil Engineering (Min 55%) + GATE / TS PGECET.",
    highlights: [
      "Wind Tunnel & Shake Table Labs",
      "Consultancy Collaborations",
      "Industry Mentorship",
    ],
  },

  // MBA Programs
  {
    id: "mba-finance",
    name: "Master of Business Administration (Finance)",
    code: "MBA-FIN",
    degree: "MBA",
    duration: "2 Years (4 Semesters)",
    seats: 60,
    annualFee: "₹2,00,000",
    description:
      "Corporate finance, investment banking, portfolio management, risk analytics, and fintech innovation.",
    eligibility: "Bachelor's degree in any discipline (Min 50%) + TSICET / CAT / MAT.",
    highlights: ["Bloomberg Terminal Access", "NSE Certification Track", "Average CTC: 8.5 LPA"],
  },
  {
    id: "mba-marketing",
    name: "Master of Business Administration (Marketing)",
    code: "MBA-MKT",
    degree: "MBA",
    duration: "2 Years (4 Semesters)",
    seats: 60,
    annualFee: "₹2,00,000",
    description:
      "Digital marketing analytics, consumer behavior, brand management, strategic sales, and omnichannel growth.",
    eligibility: "Bachelor's degree in any discipline (Min 50%) + TSICET / CAT / MAT.",
    highlights: [
      "Live Brand Consulting Projects",
      "Digital Marketing Certifications",
      "Average CTC: 8.2 LPA",
    ],
  },
  {
    id: "mba-hr",
    name: "Master of Business Administration (HR)",
    code: "MBA-HR",
    degree: "MBA",
    duration: "2 Years (4 Semesters)",
    seats: 60,
    annualFee: "₹2,00,000",
    description:
      "Strategic talent acquisition, organization design, global HR analytics, labor laws, and workplace leadership.",
    eligibility: "Bachelor's degree in any discipline (Min 50%) + TSICET / CAT / MAT.",
    highlights: ["SHRM Curriculum Alignment", "Corporate HR Mentorship", "Average CTC: 7.8 LPA"],
  },
  {
    id: "mba-it",
    name: "Master of Business Administration (IT)",
    code: "MBA-IT",
    degree: "MBA",
    duration: "2 Years (4 Semesters)",
    seats: 60,
    annualFee: "₹2,00,000",
    description:
      "IT project management, enterprise architecture, technology consulting, ERP systems, and digital transformation.",
    eligibility: "Bachelor's degree in any discipline (Min 50%) + TSICET / CAT / MAT.",
    highlights: ["Scrum Master Certification", "Enterprise Tech Practicum", "Average CTC: 9.0 LPA"],
  },
] as const;

export const quotesContent: readonly Quote[] = [
  {
    id: "quote-1",
    quote:
      "EduReach provided me the exact blend of rigorous computer science theory and bleeding-edge cloud labs. The faculty's guidance was instrumental in my journey to securing a placement at Google.",
    author: "Pooja Reddy",
    role: "Software Development Engineer @ Google",
    batchOrDept: "Class of 2023 · B.Tech CSE",
    avatar: images.quotes.alumni1,
  },
  {
    id: "quote-2",
    quote:
      "The 15:1 student-faculty ratio made a genuine difference in my research. I was able to publish two IEEE papers on VLSI architectures under Dr. Kulkarni's direct supervision.",
    author: "Aditya Verma",
    role: "Graduate Research Scholar",
    batchOrDept: "Class of 2024 · B.Tech ECE",
    avatar: images.quotes.student1,
  },
  {
    id: "quote-3",
    quote:
      "EduReach graduates stand out in technical problem-solving, communication skills, and collaborative ethics. They consistently excel in our engineering talent onboarding programs.",
    author: "Siddharth Menon",
    role: "Campus Recruitment Lead",
    batchOrDept: "Microsoft India",
    avatar: images.quotes.recruiter1,
  },
] as const;

export const mentorsContent: readonly Mentor[] = [
  {
    id: "mentor-1",
    name: "Dr. Ananya Sharma",
    designation: "Professor & Head of Department",
    department: "Computer Science & Engineering",
    qualification: "Ph.D. (IIT Bombay), M.Tech (CSE)",
    experience: "18+ Years Experience",
    specialization: "Artificial Intelligence, Distributed Systems, Cloud Architecture",
    image: images.mentors.drSharma,
  },
  {
    id: "mentor-2",
    name: "Dr. Rajeshwar Reddy",
    designation: "Dean of Academic Affairs & Professor",
    department: "Electronics & Communication Engineering",
    qualification: "Ph.D. (IISc Bangalore), M.S. (VLSI)",
    experience: "22+ Years Experience",
    specialization: "Low-Power VLSI, Embedded IoT, Wireless Signal Processing",
    image: images.mentors.drReddy,
  },
  {
    id: "mentor-3",
    name: "Dr. Meera Kulkarni",
    designation: "Professor & Director of Research",
    department: "Artificial Intelligence & Data Science",
    qualification: "Ph.D. (IIIT Hyderabad), Post-Doc (NUS Singapore)",
    experience: "15+ Years Experience",
    specialization: "Computer Vision, Deep Learning, Natural Language Processing",
    image: images.mentors.drKulkarni,
  },
  {
    id: "mentor-4",
    name: "Prof. K. Venkatesh Rao",
    designation: "Dean, School of Management Studies",
    department: "Management Studies (MBA)",
    qualification: "Ph.D. (IIM Ahmedabad), MBA (Finance)",
    experience: "20+ Years Experience",
    specialization: "Corporate Valuation, Behavioral Finance, Strategic Leadership",
    image: images.mentors.profRao,
  },
] as const;

export const campusFeatures: readonly CampusFeature[] = [
  {
    title: "25-Acre Smart Campus",
    description:
      "Fully Wi-Fi enabled sustainable green campus with modern smart classrooms and seminar halls.",
    iconName: "Wifi",
  },
  {
    title: "12 Advanced Research Labs",
    description:
      "Specialized labs for AI, Robotics, VLSI Design, Cloud Computing, and Materials Testing.",
    iconName: "Cpu",
  },
  {
    title: "Central Digital Library",
    description:
      "Over 50,000 books, 1,000+ national and international e-journals, IEEE Xplore, and Scopus access.",
    iconName: "BookOpen",
  },
  {
    title: "Hostel & Healthy Mess",
    description:
      "Separate air-cooled hostels for boys and girls with 24/7 security, high-speed internet, and dining.",
    iconName: "Home",
  },
  {
    title: "Comprehensive Sports Complex",
    description:
      "Floodlit cricket & football grounds, Olympic-standard basketball & tennis courts, and fitness gym.",
    iconName: "Trophy",
  },
  {
    title: "Innovation & Incubation Hub",
    description:
      "Start-up accelerator supporting student entrepreneurs with seed funding, mentoring, and legal support.",
    iconName: "Rocket",
  },
] as const;

export const topRecruiters: readonly Recruiter[] = [
  { name: "Google", category: "Tier 1 Tech", highestOffer: "42 LPA" },
  { name: "Microsoft", category: "Tier 1 Tech", highestOffer: "38 LPA" },
  { name: "Amazon", category: "Tier 1 Tech", highestOffer: "32 LPA" },
  { name: "Deloitte", category: "Consulting", highestOffer: "18 LPA" },
  { name: "TCS Digital", category: "IT Services", highestOffer: "12 LPA" },
  { name: "Infosys", category: "IT Services", highestOffer: "10 LPA" },
  { name: "Cognizant", category: "IT Services", highestOffer: "9 LPA" },
  { name: "Accenture", category: "Consulting & Tech", highestOffer: "14 LPA" },
] as const;

export const deptPlacements: readonly DeptPlacement[] = [
  {
    department: "Computer Science & Engineering (CSE)",
    placementRate: "96%",
    averagePackage: "10.2 LPA",
    highestPackage: "42.0 LPA",
  },
  {
    department: "AI & Data Science (AI&DS)",
    placementRate: "94%",
    averagePackage: "9.8 LPA",
    highestPackage: "36.0 LPA",
  },
  {
    department: "Electronics & Communication (ECE)",
    placementRate: "90%",
    averagePackage: "8.4 LPA",
    highestPackage: "28.0 LPA",
  },
  {
    department: "Information Technology (IT)",
    placementRate: "92%",
    averagePackage: "8.9 LPA",
    highestPackage: "26.0 LPA",
  },
  {
    department: "Management Studies (MBA)",
    placementRate: "88%",
    averagePackage: "8.5 LPA",
    highestPackage: "22.0 LPA",
  },
] as const;

export const eventsGallery = [
  {
    title: "TechMatrix Annual Hackathon",
    date: "February 2026",
    description:
      "48-hour continuous national hackathon with 500+ participants building AI and web solutions.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Tarang Cultural Fest",
    date: "April 2026",
    description:
      "3-day grand celebration of music, dance, dramatics, and arts with renowned guest performers.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Annual Convocation",
    date: "August 2025",
    description:
      "Conferring undergraduate and postgraduate degrees with distinguished industry chief guests.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export const vapiFormContent = {
  courses: [
    "B.Tech Computer Science & Engineering",
    "B.Tech Artificial Intelligence & Data Science",
    "B.Tech Electronics & Communication Engineering",
    "B.Tech Information Technology",
    "B.Tech Mechanical Engineering",
    "B.Tech Civil Engineering",
    "M.Tech Computer Science",
    "M.Tech VLSI Design & Embedded Systems",
    "M.Tech Structural Engineering",
  ],
  topics: [
    "Admissions",
    "Fees & Scholarships",
    "Placements",
    "Campus & Hostel",
    "Course Curriculum",
    "Other",
  ],
} as const;
