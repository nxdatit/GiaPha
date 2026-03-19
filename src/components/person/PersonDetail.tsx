import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Edit, UserPlus, Heart, Trash2, User, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import { useUIStore } from '../../store/uiStore';
import { getFullName } from '../../store/selectors';
import type { Person } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import PersonForm from './PersonForm';

interface PersonDetailProps {
  personId: string;
  onClose: () => void;
}

const PersonDetail: React.FC<PersonDetailProps> = ({ personId, onClose }) => {
  const { t } = useTranslation();
  const { people, deletePerson } = useFamilyTreeStore();
  const { setSelectedPerson } = useUIStore();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [showAddSpouseForm, setShowAddSpouseForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const person = people[personId];

  if (!person) {
    return null;
  }

  const father = person.fatherId ? people[person.fatherId] : undefined;
  const mother = person.motherId ? people[person.motherId] : undefined;
  const spouses = person.spouseIds
    .map((id) => people[id])
    .filter(Boolean);
  const children = person.childrenIds
    .map((id) => people[id])
    .filter(Boolean);

  const handlePersonClick = (id: string) => {
    setSelectedPerson(id);
  };

  const handleDelete = () => {
    deletePerson(personId);
    setShowDeleteConfirm(false);
    onClose();
  };

  const PersonLink: React.FC<{ person: Person }> = ({
    person: linkedPerson,
  }) => (
    <button
      type="button"
      onClick={() => handlePersonClick(linkedPerson.id)}
      className="text-blue-600 hover:text-blue-800 hover:underline text-sm text-left"
    >
      {getFullName(linkedPerson)}
    </button>
  );

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {t('person.details', 'Person Details')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar and Name */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center mb-3">
            {person.avatarBase64 ? (
              <img
                src={person.avatarBase64}
                alt={getFullName(person)}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {getFullName(person)}
          </h3>
          <span className="text-sm text-gray-500 mt-1">
            {t(`person.${person.gender}`, person.gender)} &middot;{' '}
            {t('person.generationLabel', 'Gen')} {person.generation}
          </span>
          {!person.isLiving && (
            <span className="mt-1 text-xs text-gray-400 italic">
              {t('person.deceased', 'Deceased')}
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="px-4 space-y-3 flex-1">
          {/* Dates */}
          {(person.birthDate || person.deathDate) && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
              <div>
                {person.birthDate && (
                  <div>
                    {t('person.born', 'Born')}: {person.birthDate}
                  </div>
                )}
                {person.deathDate && (
                  <div>
                    {t('person.died', 'Died')}: {person.deathDate}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Occupation */}
          {person.occupation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{person.occupation}</span>
            </div>
          )}

          {/* Hometown */}
          {person.hometown && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{person.hometown}</span>
            </div>
          )}

          {/* Notes */}
          {person.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
              <p className="font-medium text-gray-700 mb-1">{t('person.notes', 'Notes')}</p>
              <p className="whitespace-pre-wrap">{person.notes}</p>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Family Links */}
          <div className="space-y-3">
            {/* Father */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t('person.father', 'Father')}
              </p>
              {father ? (
                <PersonLink person={father} />
              ) : (
                <span className="text-sm text-gray-400">{t('person.unknown', 'Unknown')}</span>
              )}
            </div>

            {/* Mother */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t('person.mother', 'Mother')}
              </p>
              {mother ? (
                <PersonLink person={mother} />
              ) : (
                <span className="text-sm text-gray-400">{t('person.unknown', 'Unknown')}</span>
              )}
            </div>

            {/* Spouses */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t('person.spouses', 'Spouses')}
              </p>
              {spouses.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {spouses.map((spouse) => (
                    <PersonLink key={spouse.id} person={spouse} />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">{t('person.none', 'None')}</span>
              )}
            </div>

            {/* Children */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t('person.children', 'Children')}
              </p>
              {children.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {children.map((child) => (
                    <PersonLink key={child.id} person={child} />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">{t('person.none', 'None')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              {t('person.edit', 'Edit')}
            </button>
            <button
              type="button"
              onClick={() => setShowAddChildForm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100"
            >
              <UserPlus className="w-4 h-4" />
              {t('person.addChild', 'Add Child')}
            </button>
            <button
              type="button"
              onClick={() => setShowAddSpouseForm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-300 rounded-md hover:bg-purple-100"
            >
              <Heart className="w-4 h-4" />
              {t('person.addSpouse', 'Add Spouse')}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              {t('person.delete', 'Delete')}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <PersonForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        editPerson={person}
      />

      {/* Add Child Form */}
      <PersonForm
        isOpen={showAddChildForm}
        onClose={() => setShowAddChildForm(false)}
        defaultParentId={personId}
        defaultRelation="child"
      />

      {/* Add Spouse Form */}
      <PersonForm
        isOpen={showAddSpouseForm}
        onClose={() => setShowAddSpouseForm(false)}
        defaultParentId={personId}
        defaultRelation="spouse"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title={t('person.deleteTitle', 'Delete Person')}
        message={t(
          'person.deleteMessage',
          `Are you sure you want to delete ${getFullName(person)}? This action cannot be undone.`
        )}
      />
    </>
  );
};

export default PersonDetail;
