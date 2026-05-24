import { useState } from "react";
import { Input } from "@/components/ui/input";

interface QtyInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export function QtyInput({ value, onChange, className }: QtyInputProps) {
  // tempValue stores the exact string the user is typing.
  // When null, we display the strictly derived value prop.
  const [tempValue, setTempValue] = useState<string | null>(null);

  const displayValue = tempValue !== null ? tempValue : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTempValue(val);
    
    if (val === "" || val === "-") {
      onChange(0);
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = () => {
    // When the user clicks off, clear the temporary state.
    // The component will snap back to showing the true value.
    setTempValue(null);

    // Ensure the parent state is valid
    if (tempValue === "" || tempValue === "-" || (tempValue !== null && isNaN(parseInt(tempValue, 10)))) {
      onChange(0);
    } else if (tempValue !== null) {
      onChange(parseInt(tempValue, 10));
    }
  };

  return (
    <Input
      type="number"
      step="1"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
