import { useEffect, useState } from 'react';
import { FaPen, FaTrash, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { SelectFilter } from '../../components/filtros/Select';
import Tabela from '../../components/data-display/tabela';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/ui/pageHeader';
import { postUsuarioListagem } from '../../services/usuario';
import { postPerfilAcessoListagem } from '../../services/perfilAcesso';
import AtivoBadge from '../../templates/badges/AtivoBadge';
import TableDropdown from '../../templates/TableDropdown';
import UsuarioDeleteModal from './Modal';

interface PerfilAcesso {
  id: string;
  descricao: string;
}

interface Usuario {
  id: string;
  nome: string;
  login: string;
  ativo: boolean;
  perfilAcesso?: PerfilAcesso;
  descricaoPerfilAcesso?: string;
}

interface FiltrosForm {
  pesquisa: string;
  ativo: string;
  idPerfilAcesso: string;
}

export default function UsuariosPage() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 100; 

  const { register, watch, setValue } = useForm<FiltrosForm>({
    defaultValues: { pesquisa: "", ativo: "", idPerfilAcesso: "" }
  });

  const watchPesquisa = watch("pesquisa");
  const watchAtivo = watch("ativo");
  const watchIdPerfilAcesso = watch("idPerfilAcesso");

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await postPerfilAcessoListagem({
          pageSize: itemsPerPage,
          currentPage: 0,
          pesquisa: "",
          ativo: true
        });
        const listaPerfis = (response.dados as any)?.dados || response.dados || [];
        if (Array.isArray(listaPerfis)) setPerfis(listaPerfis);
      } catch (error) {
        console.error("Erro ao carregar perfis", error);
      }
    };
    fetchPerfis();
  }, []);

  const getListagem = async (page: number = currentPage) => {
    setIsLoading(true);
    
    const filtroPayload = {
      pageSize: itemsPerPage,
      currentPage: page,
      pesquisa: watchPesquisa,
      idPerfilAcesso: watchIdPerfilAcesso === "" ? null : watchIdPerfilAcesso,
      ativo: watchAtivo === "" ? null : watchAtivo === "true"
    };

    try {
      const response = await postUsuarioListagem(filtroPayload);
      
      if (response && response.success) {
        const dadosBase = (response.dados as any) || {};
        const listaFinal = dadosBase.dados || response.dados || [];
        
        setUsuarios(Array.isArray(listaFinal) ? listaFinal : []);
        
        setTotalPages(dadosBase.totalPages || dadosBase.totalPaginas || Math.ceil((listaFinal.length || 0) / itemsPerPage) || 1);
        setTotalItems(dadosBase.totalRegistros || dadosBase.totalElements || listaFinal.length || 0);
        
        setCurrentPage(page);
      } else {
        toast.error(response.mensagem || "Erro ao carregar usuários.");
        setUsuarios([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Erro de comunicação com a API.");
      setUsuarios([]);
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
  }, [watchPesquisa, watchAtivo, watchIdPerfilAcesso]);

  const handleOpenCreate = () => navigate('/usuario/form');
  const handleOpenEdit = (id: string) => navigate('/usuario/form', { state: { id } });

  const handleOpenDelete = (id: string) => {
    setCurrentId(id);
    setDeleteModalOpen(true);
  };

  const perfilOptions = perfis.map(p => ({
    value: p.id,
    label: p.descricao
  }));

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "true", label: "Ativos" },
    { value: "false", label: "Inativos" }
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans p-4 md:p-8 flex flex-col gap-6">
      <PageHeader
        title='Usuários'
        subtitle='Gestão de acessos ao sistema'
        actions={
          <Button onClick={handleOpenCreate} variant={"success"}>
            + Novo Usuário
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
              placeholder="Nome ou login..."
              className="pl-10 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-shadow"
              {...register("pesquisa")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 w-full z-20">
          <label className="text-sm font-semibold text-slate-700">Perfil de Acesso</label>
          <SelectFilter
            options={perfilOptions}
            value={watchIdPerfilAcesso}
            onChange={(val) => setValue("idPerfilAcesso", val)}
            placeholder="Filtrar perfil..."
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-56 z-10">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <SelectFilter
            options={statusOptions}
            value={watchAtivo}
            onChange={(val) => setValue("ativo", val)}
            placeholder="Todos"
          />
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
                <Tabela.Header.Row.Cell>Nome</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell>Login</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell>Perfil</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell className="text-center w-32">Status</Tabela.Header.Row.Cell>
                <Tabela.Header.Row.Cell className="text-right w-24">Ações</Tabela.Header.Row.Cell>
              </Tabela.Header.Row>
            </Tabela.Header>
            <Tabela.Body>
              {usuarios.length === 0 ? (
                <Tabela.Body.Row>
                  <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros atuais.
                  </Tabela.Body.Row.Cell>
                </Tabela.Body.Row>
              ) : (
                usuarios.map(u => (
                  <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.nome}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className="text-slate-600">{u.login}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className="text-slate-600">{u.perfilAcesso?.descricao || u.descricaoPerfilAcesso || '-'}</Tabela.Body.Row.Cell>
                    <Tabela.Body.Row.Cell className="text-center">
                      <AtivoBadge ativo={u.ativo} />
                    </Tabela.Body.Row.Cell>
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

            {usuarios.length > 0 && (
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

      <UsuarioDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        id={currentId} 
        onSuccess={() => getListagem(currentPage)} 
      />
    </div>
  );
}