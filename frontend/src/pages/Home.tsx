import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Tabela from "../components/data-display/tabela";
import { PageHeader } from "../components/ui/pageHeader";
import { AppContext } from "../context/appContext";
import { type atividadeType } from "../services/atividade";
import { getAtividadeByUser } from "../services/home";
import TableDropdown from "../templates/TableDropdown";
import ModalResposta from "./Resposta/Modal";


export default function Home() {
  const navigate = useNavigate();
  const { dadosUsuarioLogado } = useContext(AppContext);
  const [atividades, setAtividades] = useState<atividadeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalRespostaOpen, setModalRespostaOpen] = useState(false);
  const [idAtividadeSelecionada, setIdAtividadeSelecionada] = useState<number>(0);

  useEffect(() => {
    getAtividades();
  }, []);

  const getAtividades = async () => {
    setIsLoading(true);

    try {
      const response = await getAtividadeByUser();

      if (response && response.success) {
        setAtividades(response.dados || []);
      } else {
        toast.error(response.mensagem || "Erro ao carregar atividades.");
        setAtividades([]);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickEditar = (idAtividade: number) => {
    setIdAtividadeSelecionada(idAtividade);
    setModalRespostaOpen(true);
  }

  return (
    <div className="p-10">
      <div className="pb-4">
        <PageHeader
          title={`Atividades do ${dadosUsuarioLogado?.tipo}`}
          subtitle={`Visualização das atividades do ${dadosUsuarioLogado?.tipo}`}
        />
      </div>

      <Tabela>
        <Tabela.Header>
          <Tabela.Header.Row>
            <Tabela.Header.Row.Cell>Título</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Descrição</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Data Entrega</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell>Turma</Tabela.Header.Row.Cell>
            <Tabela.Header.Row.Cell className="text-right w-24">Ações</Tabela.Header.Row.Cell>
          </Tabela.Header.Row>
        </Tabela.Header>
        <Tabela.Body>
          {atividades.length === 0 ? (
            <Tabela.Body.Row>
              <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                Nenhum atividade encontrada
              </Tabela.Body.Row.Cell>
            </Tabela.Body.Row>
          ) : (
            atividades.map(u => (
              <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.titulo}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.descricao}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{format(u.data_entrega, "dd/MM/yyyy")}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.turma_descricao}</Tabela.Body.Row.Cell>
                <Tabela.Body.Row.Cell className="text-right">
                  <TableDropdown>
                    {dadosUsuarioLogado?.tipo === "ALUNO" && (
                      <TableDropdown.Option handleClick={() => handleClickEditar(u.id)}>
                        <FaPen className="mr-2" /> Responder/Editar
                      </TableDropdown.Option>
                    )}


                    {dadosUsuarioLogado?.tipo === "PROFESSOR" && (
                      <TableDropdown.Option handleClick={() => navigate("/respostas", { state: { idAtividade: u.id } })}>
                        <FaEye className="mr-2" /> Ver respostas
                      </TableDropdown.Option>
                    )}
                  </TableDropdown>
                </Tabela.Body.Row.Cell>
              </Tabela.Body.Row>
            ))
          )}
        </Tabela.Body>
      </Tabela>

      <ModalResposta
        id={null}
        idAtividade={idAtividadeSelecionada}
        open={modalRespostaOpen}
        setOpen={setModalRespostaOpen}
        updateList={getAtividades}
      />
    </div>
  )
}