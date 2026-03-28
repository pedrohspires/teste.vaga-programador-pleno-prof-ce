import { Select } from '../components/filtros/Select';

interface SelectAtivoProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export default function SelectAtivo({ value, onChange, className, label = "Status" }: SelectAtivoProps) {
  const opcoesAtivo = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Apenas Ativos' },
    { value: 'false', label: 'Apenas Inativos' },
  ];

  return (
    <Select
      label={label}
      options={opcoesAtivo}
      value={value}
      onChange={onChange}
      className={className}
      isSearchable={false}
      isClearable={false}
    />
  );
}