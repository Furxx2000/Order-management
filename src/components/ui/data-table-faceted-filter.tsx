import type { Column } from "@tanstack/react-table";

import ComboBoxResponsive from "./ComboBoxResponsive";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
}

const DataTableFacetedFilter = <TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) => {
  "use no memo";

  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const handleSelect = (value: string) => {
    const newSelectedValues = new Set(selectedValues);

    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value);
    } else {
      newSelectedValues.add(value);
    }

    const filterValues = Array.from(newSelectedValues);
    column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
  };

  return (
    <ComboBoxResponsive
      title={title}
      statuses={options}
      selectedValues={selectedValues}
      onSelect={handleSelect}
    />
  );
};

export default DataTableFacetedFilter;
