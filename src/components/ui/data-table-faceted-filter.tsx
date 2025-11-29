import ComboBoxResponsive from "./ComboBoxResponsive";

interface DataTableFacetedFilterProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
}

const DataTableFacetedFilter = ({
  title,
  options,
  selectedValues,
  onFilterChange,
}: DataTableFacetedFilterProps) => {
  "use no memo";

  const selectedSet = new Set(selectedValues);

  const handleSelect = (value: string) => {
    const newSelectedValues = new Set(selectedSet);

    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value);
    } else {
      newSelectedValues.add(value);
    }

    const filterValues = Array.from(newSelectedValues);
    onFilterChange(filterValues);
  };

  return (
    <ComboBoxResponsive
      title={title}
      statuses={options}
      selectedValues={selectedSet}
      onSelect={handleSelect}
    />
  );
};

export default DataTableFacetedFilter;
