import Input from '../ui/Input';
import Button from '../ui/Button';
import './FilterBar.css';

interface FilterBarProps {
  filters: {
    search: string;
    status: string;
    tags: string[];
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-inputs">
        <Input
          name="search"
          value={filters.search}
          onChange={(value) => updateFilter('search', value)}
          placeholder="Search jobs..."
        />
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <Button variant="secondary" size="small" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

