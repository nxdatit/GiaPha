import type { Person } from '../types';

export function validatePerson(
  data: Partial<Person>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'Họ tên đệm là bắt buộc';
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Tên là bắt buộc';
  }

  if (!data.gender) {
    errors.gender = 'Giới tính là bắt buộc';
  } else if (!['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = 'Giới tính không hợp lệ';
  }

  if (data.birthDate) {
    const birth = new Date(data.birthDate);
    if (isNaN(birth.getTime())) {
      errors.birthDate = 'Ngày sinh không hợp lệ';
    }
  }

  if (data.deathDate) {
    const death = new Date(data.deathDate);
    if (isNaN(death.getTime())) {
      errors.deathDate = 'Ngày mất không hợp lệ';
    }
  }

  if (data.birthDate && data.deathDate) {
    const birth = new Date(data.birthDate);
    const death = new Date(data.deathDate);
    if (
      !isNaN(birth.getTime()) &&
      !isNaN(death.getTime()) &&
      death <= birth
    ) {
      errors.deathDate = 'Ngày mất phải sau ngày sinh';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
