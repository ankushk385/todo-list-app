import { useNavigate } from 'react-router-dom';
import { SearchIcon } from './icons';

// looks like an input, but just opens the search page
export function SearchBar() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/search')}
      className="flex w-full items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-muted shadow-sm"
    >
      <SearchIcon className="h-4 w-4" />
      Search for a task
    </button>
  );
}
