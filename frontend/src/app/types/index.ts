export type HackathonStatus = 'live' | 'voting' | 'ended';
export interface Hackathon {
  id: string;
  title: string;
  description: string;
  status: HackathonStatus;
  registrationClose: string;
  registrationDaysLeft: number;
  techStack: string;
  level: string;
  totalPrize: number;
  location: string;
  image?: string;
  subtitle?: string;
  tags?: string[];
}
export interface Project {
  id: string;
  title: string;
  description: string;
  builder: string;
  lastEdited: string;
  tags: string[];
  likes: number;
  image?: string;
}
export interface Judge {
  name: string;
  username: string;
  avatar?: string;
}
export interface ScheduleEvent {
  id: string;
  startDate: string;
  endDate?: string;
  title?: string;
  isLive?: boolean;
}
export interface PrizeCategory {
  id: string;
  title: string;
  amount: number;
  description: string;
  winners: number;
}
export interface EvaluationCriteria {
  name: string;
  description: string;
  maxScore: number;
}