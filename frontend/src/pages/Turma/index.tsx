import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPen, FaSearch, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Tabela from '../../components/data-display/tabela';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/ui/pageHeader';
import { deleteTurma, postTurmaListagem, type filtroTurmaType, type turmaType } from '../../services/turma';
import DeleteModal from '../../templates/DeleteModal';
import TableDropdown from '../../templates/TableDropdown';
import ModalTurma from './Modal';

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<turmaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const { register, watch } = useForm<filtroTurmaType>({
    defaultValues: { search: "", }
  });

  const watchPesquisa = watch("search");

  const getListagem = async (page: number = currentPage) => {
    setIsLoading(true);

    const filtroPayload = {
      pageSize: itemsPerPage,
      currentPage: page + 1,
      search: watchPesquisa,
    };

    try {
      const response = await postTurmaListagem(filtroPayload);

      if (response && response.success) {
        const dadosBase = (response.dados as any) || {};
        const listaFinal = dadosBase.dados || response.dados || [];

        setTurmas(Array.isArray(listaFinal?.items) ? listaFinal.items : []);

        setTotalPages(dadosBase.totalPages || dadosBase.totalPaginas || Math.ceil((listaFinal.length || 0) / itemsPerPage) || 1);
        setTotalItems(dadosBase.totalRegistros || dadosBase.totalElements || listaFinal.length || 0);

        setCurrentPage(page);
      } else {
        toast.error(response.mensagem || "Erro ao carregar usuários.");
        setTurmas([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
      setTurmas([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getListagem(0);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [watchPesquisa]);

  const handleOpenCreate = () => setModalOpen(true);
  const handleOpenEdit = (id: number) => {
    setCurrentId(id);
    setModalOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setCurrentId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentId) return;
    setIsLoading(true);

    try {
      const response = await deleteTurma(currentId);

      if (!response.success) throw new Error(response.mensagem || 'Erro ao excluir');

      toast.success('Turma excluída com sucesso');
      setDeleteModalOpen(false);
      getListagem(currentPage);
    } catch (err) {
      console.error('Erro ao excluir usuário', err);
      toast.error('Erro ao excluir o usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans p-4 md:p-8 flex flex-col gap-6">
      <PageHeader
        title='Turmas'
        subtitle='Gestão de turma'
        actions={
          <Button onClick={handleOpenCreate} variant={"success"}>
            + Nova Turma
          </Button>
        }
      />

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col md:flex-row gap-4 items-end bg-white p-5 shadow-sm border border-slate-200 rounded-xl w-full transition-all">
        <div className="flex flex-col gap-1.5 flex-1 w-full relative">
          <label className="text-sm font-semibold text-slate-700">Pesquisar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Digite para pesquisar"
              className="pl-10 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-shadow"
              {...register("search")}
            />
          </div>
        </div>
      </form>

      <div className="w-full">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500 bg-white shadow-sm border border-slate-200 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <span>Carregando usuários...</span>
          </div>
        ) : (
          <Tabela>
            <Tabela.Header>
              <Tabela.Header.Row>
                <Tabela.Header.Row.Cell>Descrição</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell className="text-right w-24">Ações</Tabela.Header.Row.Cell>
              </Tabela.Header.Row>
            </Tabela.Header>
            <Tabela.Body>
              {turmas.length === 0 ? (
                <Tabela.Body.Row>
                  <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros atuais.
                  </Tabela.Body.Row.Cell>
                </Tabela.Body.Row>
              ) : (
                turmas.map(u => (
                  <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.descricao}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className="text-right">
                      <TableDropdown>
                        <TableDropdown.Option handleClick={() => handleOpenEdit(u.id)}>
                          <FaPen className="mr-2" /> Editar
                        </TableDropdown.Option>
                        <TableDropdown.Option handleClick={() => handleOpenDelete(u.id)}>
                          <FaTrash className='fill-red-500 mr-2' /> Deletar
                        </TableDropdown.Option>
                      </TableDropdown>
                    </Tabela.Body.Row.Cell>
                  </Tabela.Body.Row>
                ))
              )}
            </Tabela.Body>

            {turmas.length > 0 && (
              <Tabela.Footer
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => getListagem(page)}
              />
            )}
          </Tabela>
        )}
      </div>

      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirm={handleConfirmDelete}
      />

      <ModalTurma
        open={modalOpen}
        setOpen={setModalOpen}
        id={currentId}
        updateList={getListagem}
      />
    </div>
  );
}