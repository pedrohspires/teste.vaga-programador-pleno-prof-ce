import { useForm } from "react-hook-form";
import Formulario from "../components/formulario";


export default function Home() {
  const { control } = useForm<{ idArquivo: string }>();

  return (
    <div className="p-10">
      <Formulario onSubmit={() => { }}>
        <Formulario.Imagem control={control} name="idArquivo" title="Arquivo" />
      </Formulario>
    </div>
  )
}