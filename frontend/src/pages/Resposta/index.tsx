import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { format } from 'date-fns';
import { useLocation } from 'react-router';
import Tabela from '../../components/data-display/tabela';
import { PageHeader } from '../../components/ui/pageHeader';
import { getRespostaByAtividade, type respostaType } from '../../services/resposta';
import TableDropdown from '../../templates/TableDropdown';
import ModalCorrecao from './ModalCorrecao';

export default function RespostasPage() {
  const [respostas, setRespostas] = useState<respostaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const location = useLocation();
  const state = location.state as any;
  const idAtividade = state?.idAtividade;

  const getListagem = async () => {
    setIsLoading(true);

    try {
      const response = await getRespostaByAtividade(idAtividade);

      if (response && response.success) {
        setRespostas(Array.isArray(response?.dados) ? response.dados : []);
      } else {
        toast.error(response.mensagem || "Erro ao carregar respostas.");
        setRespostas([]);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
      setRespostas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListagem();
  }, []);

  const handleOpenEdit = (id: number) => {
    setCurrentId(id)
    setModalOpen(true);
  }

  return (
    <div className="flex-1 bg-slate-50 font-sans p-4 md:p-8 flex flex-col gap-6">
      <PageHeader
        title='Respostas'
        subtitle='Visualize e dê nota para a resposta dos alunos de suas turmas'
      />

      <div className="w-full">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500 bg-white shadow-sm border border-slate-200 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <span>Carregando respostas...</span>
          </div>
        ) : (
          <Tabela>
            <Tabela.Header>
              <Tabela.Header.Row>
                <Tabela.Header.Row.Cell>Aluno</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell>Atividade</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell>Data Entrega</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell className="text-right w-24">Ações</Tabela.Header.Row.Cell>
              </Tabela.Header.Row>
            </Tabela.Header>
            <Tabela.Body>
              {respostas.length === 0 ? (
                <Tabela.Body.Row>
                  <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                    Nenhum resposta encontrado com os filtros atuais.
                  </Tabela.Body.Row.Cell>
                </Tabela.Body.Row>
              ) : (
                respostas.map(u => (
                  <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.nome_aluno}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.titulo_atividade}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{format(u.created_at, "dd/MM/yyyy")}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className="text-right">
                      <TableDropdown>
                        <TableDropdown.Option handleClick={() => handleOpenEdit(u.id)}>
                          <FaPen className="mr-2" /> Atribuir nota
                        </TableDropdown.Option>
                      </TableDropdown>
                    </Tabela.Body.Row.Cell>
                  </Tabela.Body.Row>
                ))
              )}
            </Tabela.Body>
          </Tabela>
        )}
      </div>

      <ModalCorrecao
        open={modalOpen}
        setOpen={setModalOpen}
        idResposta={currentId}
        updateList={getListagem}
      />
    </div>
  );
}