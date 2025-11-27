interface AmountCellProps {
  amount: number;
}

export const AmountCell = ({ amount }: AmountCellProps) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return <div className="max-w-[200px] font-medium">NT$ {formattedAmount}</div>;
};
