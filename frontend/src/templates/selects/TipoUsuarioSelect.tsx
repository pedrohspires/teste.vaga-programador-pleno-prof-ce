import { useController, type Control } from "react-hook-form";
import Formulario from "../../components/formulario";
import { MySelect } from "../../components/my-select";
import { optionsTipoUsuario } from "../../utils/constants";

interface SelectTipoUsuarioProps {
  control: Control<any>;
  name: string;
  title?: string;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function SelectTipoUsuario({ className, title, name, control, isDisabled, placeholder = "Selecione" }: SelectTipoUsuarioProps) {
  const { field: { value, onChange } } = useController({ name, control });

  return (
    <div className={className}>
      <Formulario.Label htmlFor="">{title}</Formulario.Label>
      <MySelect
        options={optionsTipoUsuario}
        value={value}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
    </div>
  );
}