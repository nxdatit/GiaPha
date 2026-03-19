import React, { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import type { Person } from '../../types';
import { getFullName } from '../../store/selectors';
import { useUIStore } from '../../store/uiStore';

interface PersonNodeData {
  person: Person;
  [key: string]: unknown;
}

function extractYear(dateStr?: string): string | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : null;
}

function getBorderColor(gender: Person['gender']): string {
  switch (gender) {
    case 'male':
      return 'border-blue-400';
    case 'female':
      return 'border-pink-400';
    default:
      return 'border-gray-400';
  }
}

const PersonNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as PersonNodeData;
  const person = nodeData.person;

  const orientation = useUIStore((s) => s.orientation);
  const selectedPersonId = useUIStore((s) => s.selectedPersonId);
  const collapsedNodeIds = useUIStore((s) => s.collapsedNodeIds);
  const setSelectedPerson = useUIStore((s) => s.setSelectedPerson);
  const toggleCollapse = useUIStore((s) => s.toggleCollapse);

  const isSelected = selectedPersonId === id;
  const isCollapsed = collapsedNodeIds.includes(id);
  const hasChildren = person.childrenIds.length > 0;
  const isDeceased = !person.isLiving;

  const fullName = getFullName(person);
  const birthYear = extractYear(person.birthDate);
  const deathYear = extractYear(person.deathDate);

  const lifeSpan = birthYear
    ? deathYear
      ? `${birthYear} - ${deathYear}`
      : person.isLiving
        ? `${birthYear} - còn sống`
        : birthYear
    : '';

  const borderColor = getBorderColor(person.gender);

  const handleClick = useCallback(() => {
    setSelectedPerson(id);
  }, [id, setSelectedPerson]);

  const handleCollapseToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleCollapse(id);
    },
    [id, toggleCollapse]
  );

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border-2 cursor-pointer
        transition-all duration-200 hover:shadow-lg
        ${borderColor}
        ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
        ${isDeceased ? 'opacity-75' : ''}
      `}
      style={{ width: 200, minHeight: 80 }}
      onClick={handleClick}
    >
      {/* Target handle */}
      <Handle
        type="target"
        position={isVertical ? Position.Top : Position.Left}
        className="!bg-gray-400 !w-2 !h-2"
      />

      {/* Source handle */}
      <Handle
        type="source"
        position={isVertical ? Position.Bottom : Position.Right}
        className="!bg-gray-400 !w-2 !h-2"
      />

      <div className="flex items-center p-2 gap-2">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {person.avatarBase64 ? (
            <img
              src={person.avatarBase64}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${person.gender === 'male' ? 'bg-blue-100 text-blue-500' : ''}
                ${person.gender === 'female' ? 'bg-pink-100 text-pink-500' : ''}
                ${person.gender === 'other' ? 'bg-gray-100 text-gray-500' : ''}
              `}
            >
              <User size={20} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{fullName}</p>
          {lifeSpan && (
            <p className="text-xs text-gray-500 truncate">{lifeSpan}</p>
          )}
          {person.occupation && (
            <p className="text-xs text-gray-400 truncate italic">
              {person.occupation}
            </p>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      {hasChildren && (
        <button
          onClick={handleCollapseToggle}
          className={`
            absolute flex items-center justify-center
            w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200
            border border-gray-300 text-gray-500
            transition-colors duration-150
            ${isVertical ? '-bottom-2.5 left-1/2 -translate-x-1/2' : '-right-2.5 top-1/2 -translate-y-1/2'}
          `}
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {isCollapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronDown size={12} />
          )}
        </button>
      )}
    </div>
  );
};

export default React.memo(PersonNode);
