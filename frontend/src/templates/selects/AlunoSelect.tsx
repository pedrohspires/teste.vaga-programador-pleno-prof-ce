import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";
import Formulario from "../../components/formulario";
import { MySelect } from "../../components/my-select";
import type { selectOptionType } from "../../services/global";
import { postUsuarioListagem } from "../../services/usuario";
import { tiposUsuarioEnum } from "../../utils/constants";

interface SelectAlunoProps {
  control: Control<any>;
  name: string;
  title?: string;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function SelectAluno({ className, title, name, control, isDisabled, placeholder = "Selecione" }: SelectAlunoProps) {
  const { field: { value, onChange } } = useController({ name, control });
  const [optionsAluno, setOptionsAluno] = useState<Array<selectOptionType<number>>>([]);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    const response = await postUsuarioListagem({
      currentPage: 1,
      pageSize: 30,
      search: "",
      tipo: tiposUsuarioEnum.Aluno
    });

    const options = response.dados?.items.map(x => ({ value: x.id, label: x.nome + ` (${x.tipo})` })) || [];
    if (response.success)
      setOptionsAluno(options);

    return [...options]
  }

  return (
    <div className={className}>
      <Formulario.Label htmlFor="">{title}</Formulario.Label>
      <MySelect
        options={optionsAluno}
        value={value}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
    </div>
  );
}