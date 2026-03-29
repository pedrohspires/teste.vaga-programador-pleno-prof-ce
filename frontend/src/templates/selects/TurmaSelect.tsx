import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";
import Formulario from "../../components/formulario";
import { MySelect } from "../../components/my-select";
import type { selectOptionType } from "../../services/global";
import { postTurmaListagem } from "../../services/turma";

interface SelectTurmaProps {
  control: Control<any>;
  name: string;
  title?: string;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function SelectTurma({ className, title, name, control, isDisabled, placeholder = "Selecione" }: SelectTurmaProps) {
  const { field: { value, onChange } } = useController({ name, control });
  const [optionsTurma, setOptionsTurma] = useState<Array<selectOptionType<number>>>([]);

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    const response = await postTurmaListagem({
      currentPage: 1,
      pageSize: 30,
      search: "",
    });

    const options = response.dados?.items.map(x => ({ value: x.id, label: x.descricao })) || [];
    if (response.success)
      setOptionsTurma(options);

    return [...options]
  }

  return (
    <div className={className}>
      <Formulario.Label htmlFor="">{title}</Formulario.Label>
      <MySelect
        options={optionsTurma}
        value={value}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
    </div>
  );
}