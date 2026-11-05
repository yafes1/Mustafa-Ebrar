export type SiteMode = 'all' | 'apology' | 'coffee' | 'contract';

export type MusicType = 'sensiz-olmaz' | 'synth-piano' | 'music-box' | 'synth-lofi' | 'custom-url' | 'custom-file';

export interface MusicConfig {
  type: MusicType;
  title: string;
  customUrl?: string;
  fileName?: string;
}

export interface CoupleConfig {
  receiverName: string; // The person being apologized to / asked out
  senderName: string;   // The person apologizing
  customNote?: string;  // Personal message
  customReason?: string;
  daysApart?: number;
  mode?: SiteMode;
  musicConfig?: MusicConfig;
}

export interface CoffeePlan {
  drink: string;
  dessert: string;
  place: string;
  time: string;
  note: string;
}

export interface ReasonItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface ContractClause {
  id: string;
  text: string;
  checked: boolean;
}
