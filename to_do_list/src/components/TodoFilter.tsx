import { useTodoStore } from '../store/useTodoStore';
import type { FilterType } from '../types/todo';

const filterLabels = {
  All: '全部',
  Active: '进行中',
  Completed: '已完成'
};

export const TodoFilter = () => {
  const filter = useTodoStore(state => state.filter);
  const setFilter = useTodoStore(state => state.setFilter);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="flex gap-2 mb-6 justify-center">
      {Object.entries(filterLabels).map(([key, label]) => (
        <button
          key={key}
          onClick={() => handleFilterChange(key as FilterType)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};