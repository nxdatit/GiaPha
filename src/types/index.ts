export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  isLiving: boolean;
  avatarBase64?: string;
  occupation?: string;
  hometown?: string;
  notes?: string;
  generation: number;
  fatherId?: string;
  motherId?: string;
  spouseIds: string[];
  childrenIds: string[];
}

export interface Relationship {
  id: string;
  type: 'parent-child' | 'spouse';
  fromPersonId: string;
  toPersonId: string;
  marriageDate?: string;
  divorceDate?: string;
}

export interface FamilyTreeMetadata {
  treeName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  rootPersonId?: string;
}

export interface FamilyTreeData {
  version: number;
  metadata: FamilyTreeMetadata;
  people: Record<string, Person>;
  relationships: Relationship[];
}

export type TreeOrientation = 'vertical' | 'horizontal';
export type Language = 'vi' | 'en';

export interface FilterState {
  generation?: number;
  occupation?: string;
  hometown?: string;
}
