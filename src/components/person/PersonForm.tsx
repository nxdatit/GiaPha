import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import AvatarUpload from './AvatarUpload';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import { getFullName } from '../../store/selectors';
import type { Person } from '../../types';

interface PersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  editPerson?: Person;
  defaultParentId?: string;
  defaultRelation?: 'child' | 'spouse';
}

interface PersonFormData {
  lastName: string;
  firstName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  deathDate: string;
  isLiving: boolean;
  occupation: string;
  hometown: string;
  notes: string;
  generation: number;
  fatherId: string;
  motherId: string;
  avatarBase64?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({
  isOpen,
  onClose,
  editPerson,
  defaultParentId,
  defaultRelation,
}) => {
  const { t } = useTranslation();
  const { people, addPerson, updatePerson, addSpouseRelation, addChildRelation } =
    useFamilyTreeStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>({
    defaultValues: {
      lastName: '',
      firstName: '',
      gender: 'male',
      birthDate: '',
      deathDate: '',
      isLiving: true,
      occupation: '',
      hometown: '',
      notes: '',
      generation: 0,
      fatherId: '',
      motherId: '',
      avatarBase64: undefined,
    },
  });

  const isLiving = watch('isLiving');

  const peopleList = useMemo(() => Object.values(people), [people]);
  const males = useMemo(() => peopleList.filter((p) => p.gender === 'male'), [peopleList]);
  const females = useMemo(() => peopleList.filter((p) => p.gender === 'female'), [peopleList]);

  useEffect(() => {
    if (isOpen) {
      if (editPerson) {
        reset({
          lastName: editPerson.lastName,
          firstName: editPerson.firstName,
          gender: editPerson.gender,
          birthDate: editPerson.birthDate || '',
          deathDate: editPerson.deathDate || '',
          isLiving: editPerson.isLiving,
          occupation: editPerson.occupation || '',
          hometown: editPerson.hometown || '',
          notes: editPerson.notes || '',
          generation: editPerson.generation,
          fatherId: editPerson.fatherId || '',
          motherId: editPerson.motherId || '',
          avatarBase64: editPerson.avatarBase64,
        });
      } else {
        reset({
          lastName: '',
          firstName: '',
          gender: 'male',
          birthDate: '',
          deathDate: '',
          isLiving: true,
          occupation: '',
          hometown: '',
          notes: '',
          generation: 0,
          fatherId: '',
          motherId: '',
          avatarBase64: undefined,
        });
      }
    }
  }, [isOpen, editPerson, reset]);

  const onSubmit = (data: PersonFormData) => {
    const personData: Omit<Person, 'id' | 'spouseIds' | 'childrenIds'> & {
      spouseIds?: string[];
      childrenIds?: string[];
    } = {
      lastName: data.lastName,
      firstName: data.firstName,
      gender: data.gender,
      birthDate: data.birthDate || undefined,
      deathDate: data.isLiving ? undefined : data.deathDate || undefined,
      isLiving: data.isLiving,
      occupation: data.occupation || undefined,
      hometown: data.hometown || undefined,
      notes: data.notes || undefined,
      generation: data.generation,
      fatherId: data.fatherId || undefined,
      motherId: data.motherId || undefined,
      avatarBase64: data.avatarBase64,
    };

    if (editPerson) {
      updatePerson(editPerson.id, personData);
    } else {
      const newPersonId = addPerson(personData as Omit<Person, 'id'>);

      if (defaultParentId && newPersonId) {
        if (defaultRelation === 'child') {
          const parent = people[defaultParentId];
          const parentType = parent?.gender === 'female' ? 'mother' : 'father';
          addChildRelation(defaultParentId, newPersonId, parentType);
        } else if (defaultRelation === 'spouse') {
          addSpouseRelation(defaultParentId, newPersonId);
        }
      }
    }

    onClose();
  };

  const isEditing = !!editPerson;
  const title = isEditing
    ? t('person.editTitle', 'Edit Person')
    : t('person.addTitle', 'Add Person');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          <Controller
            name="avatarBase64"
            control={control}
            render={({ field }) => (
              <AvatarUpload value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.lastName', 'Last Name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('lastName', {
                required: t('person.lastNameRequired', 'Last name is required'),
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('person.lastNamePlaceholder', 'e.g. Nguyen')}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.firstName', 'First Name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('firstName', {
                required: t('person.firstNameRequired', 'First name is required'),
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('person.firstNamePlaceholder', 'e.g. Van A')}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        {/* Gender and Generation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.gender', 'Gender')} <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="male">{t('person.male', 'Male')}</option>
              <option value="female">{t('person.female', 'Female')}</option>
              <option value="other">{t('person.other', 'Other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.generation', 'Generation')}
            </label>
            <input
              type="number"
              {...register('generation', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Birth/Death dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.birthDate', 'Birth Date')}
            </label>
            <input
              type="date"
              {...register('birthDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.deathDate', 'Death Date')}
            </label>
            <input
              type="date"
              {...register('deathDate')}
              disabled={isLiving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </div>

        {/* Is Living */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isLiving"
            {...register('isLiving')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isLiving" className="text-sm font-medium text-gray-700">
            {t('person.isLiving', 'Currently living')}
          </label>
        </div>

        {/* Occupation and Hometown */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.occupation', 'Occupation')}
            </label>
            <input
              type="text"
              {...register('occupation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.hometown', 'Hometown')}
            </label>
            <input
              type="text"
              {...register('hometown')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Father and Mother */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.father', 'Father')}
            </label>
            <select
              {...register('fatherId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('person.none', '-- None --')}</option>
              {males
                .filter((p) => p.id !== editPerson?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {getFullName(p)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('person.mother', 'Mother')}
            </label>
            <select
              {...register('motherId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('person.none', '-- None --')}</option>
              {females
                .filter((p) => p.id !== editPerson?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {getFullName(p)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('person.notes', 'Notes')}
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? t('common.save', 'Save') : t('common.add', 'Add')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PersonForm;
