import {
  DealPriority,
  SponsorshipMode,
  SponsorshipStage,
} from "@/enums/sponsorship";

export interface Deal {
  id: number;
  brand: string;
  logo: string;
  logoColor: string;
  value: number;
  stage: SponsorshipStage;
  category: string;
  contact: string;
  email: string;
  deadline: string;
  notes: string;
  priority: DealPriority;
  added: string;
  month?: number;
}

export interface DealModalState {
  deal?: Deal;
  defaultStage?: SponsorshipStage;
}

export interface DealFormState {
  brand: string;
  logo: string;
  category: string;
  value: number;
  stage: SponsorshipStage;
  contact: string;
  email: string;
  deadline: string;
  notes: string;
  priority: DealPriority;
}

export interface SponsorshipViewState {
  mode: SponsorshipMode;
  search: string;
}
