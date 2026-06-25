interface ChipProps {
  value: number;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (value: number) => void;
}

export default function Chip({ value, selected = false, disabled = false, onSelect }: ChipProps) {
  return (
    <button
      type="button"
      className={["craps-chip", selected ? "craps-chip--selected" : ""].join(" ")}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect?.(value)}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="46" className="craps-chip__outer" />
        <circle cx="50" cy="50" r="35" className="craps-chip__inner" />
        {Array.from({ length: 12 }).map((_, index) => (
          <rect
            key={index}
            x="47"
            y="3"
            width="6"
            height="18"
            rx="2"
            className="craps-chip__notch"
            transform={`rotate(${index * 30} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="24" className="craps-chip__center" />
      </svg>
      <span>{formatChip(value)}</span>
    </button>
  );
}

function formatChip(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}
