import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type {
  Person,
  Relationship,
  FamilyTreeMetadata,
  FamilyTreeData,
} from '../types';

interface FamilyTreeState {
  people: Record<string, Person>;
  relationships: Relationship[];
  metadata: FamilyTreeMetadata;

  addPerson: (person: Omit<Person, 'id'>) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;

  addSpouseRelation: (personId: string, spouseId: string) => void;
  addChildRelation: (
    parentId: string,
    childId: string,
    parentType: 'father' | 'mother'
  ) => void;

  importData: (data: FamilyTreeData) => void;
  exportData: () => FamilyTreeData;
  clearAll: () => void;
}

const initialMetadata: FamilyTreeMetadata = {
  treeName: 'Gia phả',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useFamilyTreeStore = create<FamilyTreeState>()(
  persist(
    (set, get) => ({
      people: {},
      relationships: [],
      metadata: initialMetadata,

      addPerson: (person) => {
        const id = nanoid();
        const newPerson: Person = { ...person, id };

        set((state) => {
          const isFirst = Object.keys(state.people).length === 0;
          return {
            people: { ...state.people, [id]: newPerson },
            metadata: {
              ...state.metadata,
              updatedAt: new Date().toISOString(),
              rootPersonId: isFirst ? id : state.metadata.rootPersonId,
            },
          };
        });

        return id;
      },

      updatePerson: (id, updates) => {
        set((state) => {
          const existing = state.people[id];
          if (!existing) return state;

          return {
            people: {
              ...state.people,
              [id]: { ...existing, ...updates, id },
            },
            metadata: {
              ...state.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      deletePerson: (id) => {
        set((state) => {
          const person = state.people[id];
          if (!person) return state;

          const updatedPeople = { ...state.people };

          // Clean up references in other people
          for (const [otherId, otherPerson] of Object.entries(updatedPeople)) {
            if (otherId === id) continue;

            let changed = false;
            const updated = { ...otherPerson };

            if (updated.fatherId === id) {
              updated.fatherId = undefined;
              changed = true;
            }

            if (updated.motherId === id) {
              updated.motherId = undefined;
              changed = true;
            }

            if (updated.spouseIds.includes(id)) {
              updated.spouseIds = updated.spouseIds.filter(
                (sid) => sid !== id
              );
              changed = true;
            }

            if (updated.childrenIds.includes(id)) {
              updated.childrenIds = updated.childrenIds.filter(
                (cid) => cid !== id
              );
              changed = true;
            }

            if (changed) {
              updatedPeople[otherId] = updated;
            }
          }

          delete updatedPeople[id];

          // Remove relationships involving this person
          const updatedRelationships = state.relationships.filter(
            (r) => r.fromPersonId !== id && r.toPersonId !== id
          );

          return {
            people: updatedPeople,
            relationships: updatedRelationships,
            metadata: {
              ...state.metadata,
              updatedAt: new Date().toISOString(),
              rootPersonId:
                state.metadata.rootPersonId === id
                  ? undefined
                  : state.metadata.rootPersonId,
            },
          };
        });
      },

      addSpouseRelation: (personId, spouseId) => {
        set((state) => {
          const person = state.people[personId];
          const spouse = state.people[spouseId];
          if (!person || !spouse) return state;

          const updatedPerson = {
            ...person,
            spouseIds: person.spouseIds.includes(spouseId)
              ? person.spouseIds
              : [...person.spouseIds, spouseId],
          };

          const updatedSpouse = {
            ...spouse,
            spouseIds: spouse.spouseIds.includes(personId)
              ? spouse.spouseIds
              : [...spouse.spouseIds, personId],
          };

          const relationship: Relationship = {
            id: nanoid(),
            type: 'spouse',
            fromPersonId: personId,
            toPersonId: spouseId,
          };

          return {
            people: {
              ...state.people,
              [personId]: updatedPerson,
              [spouseId]: updatedSpouse,
            },
            relationships: [...state.relationships, relationship],
            metadata: {
              ...state.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      addChildRelation: (parentId, childId, parentType) => {
        set((state) => {
          const parent = state.people[parentId];
          const child = state.people[childId];
          if (!parent || !child) return state;

          const updatedParent = {
            ...parent,
            childrenIds: parent.childrenIds.includes(childId)
              ? parent.childrenIds
              : [...parent.childrenIds, childId],
          };

          const updatedChild = {
            ...child,
            [parentType === 'father' ? 'fatherId' : 'motherId']: parentId,
          };

          const relationship: Relationship = {
            id: nanoid(),
            type: 'parent-child',
            fromPersonId: parentId,
            toPersonId: childId,
          };

          return {
            people: {
              ...state.people,
              [parentId]: updatedParent,
              [childId]: updatedChild,
            },
            relationships: [...state.relationships, relationship],
            metadata: {
              ...state.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      importData: (data) => {
        set({
          people: data.people,
          relationships: data.relationships,
          metadata: {
            ...data.metadata,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      exportData: () => {
        const state = get();
        return {
          version: 1,
          metadata: state.metadata,
          people: state.people,
          relationships: state.relationships,
        };
      },

      clearAll: () => {
        set({
          people: {},
          relationships: [],
          metadata: {
            treeName: 'Gia phả',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rootPersonId: undefined,
          },
        });
      },
    }),
    {
      name: 'family-tree-storage',
    }
  )
);
