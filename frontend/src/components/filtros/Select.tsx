import Select, { type StylesConfig } from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

interface SelectFilterProps {
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  noOptionsMessage?: string;
  isDisabled?: boolean;
}

export function SelectFilter({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  noOptionsMessage = "Nenhuma opção encontrada",
  isDisabled = false
}: SelectFilterProps) {
  
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const customStyles: StylesConfig<OptionType, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#94a3b8' 
      },
      transition: 'all 0.2s ease-in-out'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      isClearable
      isDisabled={isDisabled}
      placeholder={placeholder}
      noOptionsMessage={() => noOptionsMessage}
      onChange={(selected) => {
        onChange(selected ? selected.value : "");
      }}
      styles={customStyles}
    />
  );
}