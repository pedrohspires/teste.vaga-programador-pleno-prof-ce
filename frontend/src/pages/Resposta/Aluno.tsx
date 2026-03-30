import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Tabela from "../../components/data-display/tabela";
import { PageHeader } from "../../components/ui/pageHeader";
import { type correcaoRespostaType } from "../../services/correcao";
import { getMeCorrecoes } from "../../services/home";

export default function RespostaAluno() {
  const [correcoes, setCorrecoes] = useState<correcaoRespostaType[]>([]);

  useEffect(() => {
    getCorrecoes();
  }, []);

  const getCorrecoes = async () => {
    try {
      const response = await getMeCorrecoes();

      if (response && response.success) {
        setCorrecoes(response.dados || []);
      } else {
        toast.error(response.mensagem || "Erro ao carregar correcoes.");
        setCorrecoes([]);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
    }
  };

  return (
    <div className="p-10">
      <div className="pb-4">
        <PageHeader
          title={`Suas respostas`}
          subtitle={`Visualização das respostas`}
        />
      </div>

      <Tabela>
        <Tabela.Header>
          <Tabela.Header.Row>
            <Tabela.Header.Row.Cell>Título</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Resposta</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Data Entrega</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Nota</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Feedback</Tabela.Header.Row.Cell>
          </Tabela.Header.Row>
        </Tabela.Header>
        <Tabela.Body>
          {correcoes.length === 0 ? (
            <Tabela.Body.Row>
              <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                Nenhum correcao encontrada
              </Tabela.Body.Row.Cell>
            </Tabela.Body.Row>
          ) : (
            correcoes.map(u => (
              <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.titulo_atividade}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.conteudo_resposta}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{format(u.created_at, "dd/MM/yyyy")}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.nota || "Não corrigido"}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.feedback_professor || "Não informado"}</Tabela.Body.Row.Cell>
              </Tabela.Body.Row>
            ))
          )}
        </Tabela.Body>
      </Tabela>
    </div>
  )
}