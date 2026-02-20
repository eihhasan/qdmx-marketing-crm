import { create } from 'zustand';
import { Lead, User, Activity, DealStage, LeadStatus, Campaign, FeedItem } from '../types';
import { format, subDays } from 'date-fns';

interface CRMState {
  leads: Lead[];
  users: User[];
  activities: Activity[];
  campaigns: Campaign[];
  feeds: FeedItem[];
  currentUser: User | null;
  selectedLeadId: string | null;
  isAddLeadModalOpen: boolean;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLeadStage: (id: string, newStage: DealStage) => void;
  addActivity: (activity: Activity) => void;
  setCurrentUser: (user: User) => void;
  setSelectedLeadId: (id: string | null) => void;
  setAddLeadModalOpen: (isOpen: boolean) => void;
  linkFeedToLead: (feedId: string, leadId: string) => void;
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Amit Sharma', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Ms. Priya Verma', role: 'Sales Manager', avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Mr. Rahul Singh', role: 'Marketing Manager', avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Ms. Neha Gupta', role: 'Sales Executive', avatar: 'https://i.pravatar.cc/150?u=u4' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'B.Tech Admissions 2025',
    platform: 'Google',
    status: 'Active',
    budget: 120000,
    spent: 74500,
    clicks: 18400,
    conversions: 980,
    aiOptimizationScore: 94,
    roi: 4.2,
  },
  {
    id: 'c2',
    name: 'MBA Lead Generation',
    platform: 'Facebook',
    status: 'Active',
    budget: 85000,
    spent: 51200,
    clicks: 12600,
    conversions: 540,
    aiOptimizationScore: 88,
    roi: 3.1,
  },
  {
    id: 'c3',
    name: 'Pharmacy & Para-Medical',
    platform: 'Instagram',
    status: 'Active',
    budget: 60000,
    spent: 38700,
    clicks: 9800,
    conversions: 320,
    aiOptimizationScore: 91,
    roi: 2.8,
  },
  {
    id: 'c4',
    name: 'BCA / MCA Awareness',
    platform: 'LinkedIn',
    status: 'Paused',
    budget: 45000,
    spent: 18300,
    clicks: 4200,
    conversions: 115,
    aiOptimizationScore: 62,
    roi: 1.1,
  },
  {
    id: 'c5',
    name: 'Law & Humanities Drive',
    platform: 'Facebook',
    status: 'Active',
    budget: 50000,
    spent: 29800,
    clicks: 7100,
    conversions: 210,
    aiOptimizationScore: 85,
    roi: 2.4,
  },
  {
    id: 'c6',
    name: 'Distance Learning 2025',
    platform: 'Google',
    status: 'Active',
    budget: 70000,
    spent: 42000,
    clicks: 11500,
    conversions: 430,
    aiOptimizationScore: 89,
    roi: 3.5,
  },
];

const MOCK_FEEDS: FeedItem[] = [
  {
    id: 'f1',
    type: 'Social Post',
    title: 'Applications Open for B.Tech 2025 – Invertis University',
    content: 'Unlock your engineering future! Invertis University is now accepting applications for B.Tech 2025-26. Industry-aligned curriculum, top placements, and vibrant campus life await. Apply now! #BTech #Engineering #InvertisUniversity',
    platform: 'Instagram',
    url: 'https://www.invertisuniversity.ac.in/academics',
    timestamp: subDays(new Date(), 1).toISOString(),
    metrics: { views: 24500, likes: 1840, shares: 310, comments: 97 },
    linkedLeadIds: ['l1', 'l3', 'l7'],
  },
  {
    id: 'f2',
    type: 'Blog Article',
    title: 'Why Choose Invertis University for Your MBA in 2025?',
    content: 'Discover how Invertis University MBA program blends global business insights with hands-on industry exposure. From live projects to corporate tie-ups, our graduates lead the way.',
    platform: 'Website',
    url: 'https://www.invertisuniversity.ac.in/academics',
    timestamp: subDays(new Date(), 4).toISOString(),
    metrics: { views: 8700, likes: 0, shares: 215, comments: 34 },
    linkedLeadIds: ['l2', 'l9'],
  },
  {
    id: 'f3',
    type: 'Social Post',
    title: 'Campus Life at Invertis – More Than Just Academics',
    content: 'Sports, cultural fests, hackathons and more! Get a glimpse of the vibrant campus life at Invertis University, Bareilly. #CampusLife #InvertisUniversity #StudentLife',
    platform: 'Instagram',
    url: 'https://www.invertisuniversity.ac.in',
    timestamp: subDays(new Date(), 2).toISOString(),
    metrics: { views: 13200, likes: 2100, shares: 185, comments: 63 },
    linkedLeadIds: ['l5', 'l12'],
  },
  {
    id: 'f4',
    type: 'SEO Page',
    title: 'Best Engineering College in Bareilly – Invertis University',
    content: 'Landing page targeting "best engineering college Bareilly 2025" – showcasing NAAC accreditation, placement records, and scholarship programs at Invertis University.',
    platform: 'Website',
    url: 'https://www.invertisuniversity.ac.in/academics',
    timestamp: subDays(new Date(), 12).toISOString(),
    metrics: { views: 41000, likes: 0, shares: 0, comments: 0 },
    linkedLeadIds: ['l4', 'l6', 'l10', 'l15'],
  },
  {
    id: 'f5',
    type: 'Social Post',
    title: 'Scholarship Opportunities at Invertis University 2025',
    content: 'Meritorious students can avail up to 100% scholarship! Do not let finances stop your dreams. Explore scholarship options at Invertis University today. #Scholarship #HigherEducation',
    platform: 'Facebook',
    url: 'https://www.invertisuniversity.ac.in',
    timestamp: subDays(new Date(), 3).toISOString(),
    metrics: { views: 19800, likes: 1430, shares: 420, comments: 88 },
    linkedLeadIds: ['l8', 'l11', 'l14'],
  },
  {
    id: 'f6',
    type: 'Blog Article',
    title: 'Top Placement Recruiters at Invertis University – Batch 2024',
    content: 'With 500+ recruiters on campus and average packages touching 6 LPA, see why Invertis University is the preferred choice for students across UP and Uttarakhand.',
    platform: 'LinkedIn',
    url: 'https://www.invertisuniversity.ac.in',
    timestamp: subDays(new Date(), 6).toISOString(),
    metrics: { views: 11400, likes: 620, shares: 310, comments: 47 },
    linkedLeadIds: ['l13', 'l16'],
  },
];

// Realistic Indian student names for Invertis University context
const STUDENT_NAMES = [
  'Aarav Sharma', 'Priya Singh', 'Rohit Gupta', 'Sneha Verma', 'Ankur Tiwari',
  'Divya Yadav', 'Karan Mishra', 'Pooja Srivastava', 'Mohit Pandey', 'Riya Agarwal',
  'Amit Kumar', 'Sanya Jain', 'Vikash Rai', 'Nisha Chauhan', 'Harshit Saxena',
  'Priyanka Tripathi', 'Gaurav Awasthi', 'Ananya Dubey', 'Shubham Singh', 'Kajal Patel',
  'Vivek Shukla', 'Deepika Yadav', 'Rahul Kushwaha', 'Meera Tiwari', 'Ayush Bhatia',
  'Ritika Chaudhary', 'Sumit Rajput', 'Pallavi Misra', 'Nikhil Sharma', 'Swati Gupta',
  'Aditya Verma', 'Kavita Singh', 'Piyush Bajpai', 'Tanvi Rastogi', 'Mayank Soni',
  'Shreya Joshi', 'Abhishek Dixit', 'Monika Rawat', 'Tushar Goel', 'Anjali Kapoor',
  'Lokesh Dwivedi', 'Sonal Agarwal', 'Manish Pal', 'Bhavna Pandey', 'Siddharth Kanpur',
  'Renu Varshney', 'Akash Malhotra', 'Nidhi Upadhyay', 'Yash Trivedi', 'Preeti Maurya',
];

const COURSES = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech Civil',
  'MBA', 'BBA', 'MCA', 'BCA',
  'B.Pharmacy', 'M.Pharmacy', 'B.Sc Nursing', 'LLB', 'B.Ed',
];

const generateMockLeads = (): Lead[] => {
  const leads: Lead[] = [];
  const stages: DealStage[] = ['New Lead', 'AI Nurturing', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const sources = ['Facebook Ads', 'Google Ads', 'Instagram', 'Website', 'Referral', 'Manual', 'LinkedIn', 'TikTok'];
  const actions = [
    'Send Admission Brochure',
    'Schedule Campus Visit',
    'Call Prospective Student',
    'Send Scholarship Details',
    'Share Placement Report',
    'Invite to Open Day',
    'Follow Up on Application',
    'Connect on LinkedIn',
  ];

  const statusOptions: LeadStatus[] = ['Visitor', 'Lead', 'MQL', 'SQL', 'Opportunity', 'Won', 'Lost'];

  for (let i = 0; i < 50; i++) {
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const score = Math.floor(Math.random() * 100);
    const name = STUDENT_NAMES[i % STUDENT_NAMES.length];
    const nameParts = name.split(' ');
    const firstName = nameParts[0].toLowerCase();
    const lastName = (nameParts[1] || 'student').toLowerCase();
    const course = COURSES[Math.floor(Math.random() * COURSES.length)];
    const feeAmount = course.startsWith('M') || course === 'MBA'
      ? Math.floor(Math.random() * 80000) + 80000
      : Math.floor(Math.random() * 60000) + 60000;

    leads.push({
      id: `l${i}`,
      name: name,
      company: course,
      email: `${firstName}.${lastName}${i}@gmail.com`,
      phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      source: source as any,
      score: score,
      aiScore: Math.min(100, Math.floor(score * (0.8 + Math.random() * 0.4))),
      predictedLTV: feeAmount * (Math.floor(Math.random() * 3) + 1),
      nextBestAction: actions[Math.floor(Math.random() * actions.length)],
      ownerId: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].id,
      createdAt: subDays(new Date(), Math.floor(Math.random() * 45)).toISOString(),
      lastInteraction: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      dealValue: feeAmount,
      stage: stage,
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      tags: Math.random() > 0.5 ? ['High Intent'] : ['Nurture'],
      nextFollowUp: Math.random() > 0.4
        ? format(subDays(new Date(), -Math.floor(Math.random() * 7)), 'yyyy-MM-dd')
        : undefined,
    });
  }
  return leads;
};

export const useCRMStore = create<CRMState>((set) => ({
  leads: generateMockLeads(),
  users: MOCK_USERS,
  activities: [],
  campaigns: MOCK_CAMPAIGNS,
  feeds: MOCK_FEEDS,
  currentUser: MOCK_USERS[0],
  selectedLeadId: null,
  isAddLeadModalOpen: false,
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  moveLeadStage: (id, newStage) =>
    set((state) => {
      const lead = state.leads.find((l) => l.id === id);
      if (!lead || lead.stage === newStage) return state;

      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        leadId: id,
        type: 'Status Change',
        description: `Stage changed from ${lead.stage} to ${newStage}`,
        timestamp: new Date().toISOString(),
        userId: state.currentUser?.id || 'system',
      };

      return {
        leads: state.leads.map((l) =>
          l.id === id
            ? {
              ...l,
              stage: newStage,
              lastInteraction: new Date().toISOString(),
            }
            : l
        ),
        activities: [newActivity, ...state.activities],
      };
    }),
  addActivity: (activity) =>
    set((state) => ({ activities: [activity, ...state.activities] })),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setAddLeadModalOpen: (isOpen) => set({ isAddLeadModalOpen: isOpen }),
  linkFeedToLead: (feedId, leadId) =>
    set((state) => ({
      feeds: state.feeds.map((f) =>
        f.id === feedId
          ? { ...f, linkedLeadIds: [...f.linkedLeadIds, leadId] }
          : f
      ),
    })),
}));
