import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Tabela from "../components/data-display/tabela";
import { PageHeader } from "../components/ui/pageHeader";
import { AppContext } from "../context/appContext";
import { type atividadeType } from "../services/atividade";
import { getMeAtividadeByUser } from "../services/home";
import TableDropdown from "../templates/TableDropdown";
import ModalResposta from "./Resposta/Modal";
import ModalVisualizarCorrecao from "./Resposta/ModalVisualizarCorrecao";


export default function Home() {
  const navigate = useNavigate();
  const { dadosUsuarioLogado } = useContext(AppContext);
  const [atividades, setAtividades] = useState<atividadeType[]>([]);
  const [idCorrecaoSelecionada, setIdCorrecaoSelecionada] = useState<number>(0);
  const [modalVerCorrecaoOpen, setModalVerCorrecaoOpen] = useState(false);
  const [modalRespostaOpen, setModalRespostaOpen] = useState(false);
  const [idAtividadeSelecionada, setIdAtividadeSelecionada] = useState<number>(0);

  useEffect(() => {
    getAtividades();
  }, []);

  const getAtividades = async () => {

    try {
      const response = await getMeAtividadeByUser();

      if (response && response.success) {
        setAtividades(response.dados || []);
      } else {
        toast.error(response.mensagem || "Erro ao carregar atividades.");
        setAtividades([]);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
    }
  };

  const handleClickEditar = (idAtividade: number) => {
    setIdAtividadeSelecionada(idAtividade);
    setModalRespostaOpen(true);
  }

  const handleClickVerCorrecao = (idCorrecao: number) => {
    setIdCorrecaoSelecionada(idCorrecao);
    setModalVerCorrecaoOpen(true);
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
            {dadosUsuarioLogado?.tipo === "ALUNO" && <Tabela.Header.Row.Cell>Nota</Tabela.Header.Row.Cell>}
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
                {dadosUsuarioLogado?.tipo === "ALUNO" && <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{!u.id_correcao ? "Não corrigida" : u.nota}</Tabela.Body.Row.Cell>}
                <Tabela.Body.Row.Cell className="text-right">
                  <TableDropdown>
                    {dadosUsuarioLogado?.tipo === "ALUNO" && (
                      <>
                        {!u.id_correcao && (
                          <TableDropdown.Option handleClick={() => handleClickEditar(u.id)}>
                            <FaPen className="mr-2" /> Responder/Editar
                          </TableDropdown.Option>
                        )}

                        {!!u.id_correcao && (
                          <TableDropdown.Option handleClick={() => handleClickVerCorrecao(u.id)}>
                            <FaEye className="mr-2" /> Ver correção
                          </TableDropdown.Option>
                        )}
                      </>
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

      <ModalVisualizarCorrecao
        id={idCorrecaoSelecionada}
        open={modalVerCorrecaoOpen}
        setOpen={setModalVerCorrecaoOpen}
      />
    </div>
  )
}