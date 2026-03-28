import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { FaSave, FaTimes, FaKey } from 'react-icons/fa';
import { SideModal } from '../../components/ui/sideModal';
import { Button } from '../../components/ui/button';
import { postUsuario, putUsuario, getUsuarioById, patchAlterarSenha } from '../../services/usuario';
import { postPerfilAcessoListagem, type PerfilAcessoType } from '../../services/perfilAcesso';
import { postPessoaListagem } from '../../services/pessoa';
import { PageHeader } from '../../components/ui/pageHeader';
import { SelectFilter } from '../../components/filtros/Select';

type UsuarioFormData = {
    nome: string;
    login: string;
    senha?: string;
    confirmacaoSenha?: string;
    idPerfilAcesso: string;
    idPessoa: string | null;
    ativo: boolean;
}

export default function UsuarioFormPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const idEdicao = location.state?.id;
    const isEditing = Boolean(idEdicao);

    const [isLoading, setIsLoading] = useState(false);
    const [perfisAcesso, setPerfisAcesso] = useState<PerfilAcessoType[]>([]);

    // Estado para guardar a lista de Pessoas pro Select
    const [pessoasOptions, setPessoasOptions] = useState<{ value: string; label: string }[]>([]);

    const [isPwdModalOpen, setPwdModalOpen] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);

    const { handleSubmit, register, watch, setValue, formState: { errors }, reset } = useForm<UsuarioFormData>({
        defaultValues: { nome: '', login: '', senha: '', confirmacaoSenha: '', idPerfilAcesso: '', idPessoa: null, ativo: true }
    });

    const { register: registerPwd, handleSubmit: handlePwdSubmit, reset: resetPwd } = useForm<{ senha: string; confirmacaoSenha: string }>();

    useEffect(() => {
        const carregarPerfisEPessoas = async () => {
            // Busca Perfis
            const resPerfis = await postPerfilAcessoListagem({ pageSize: 100, currentPage: 0, pesquisa: "", ativo: true });
            if (resPerfis.success) setPerfisAcesso(resPerfis.dados?.dados || []);

            // Busca Pessoas para preencher o Select (sem o campo ativo, que não existe em Pessoa)
            try {
                // Forçamos o 'as any' caso a interface exija campos que não temos aqui
                const resPessoas = await postPessoaListagem({ pageSize: 500, currentPage: 0, pesquisa: "" } as any);

                // Forçamos a tipagem para any[] para o TypeScript liberar o .map()
                const listaPessoas: any[] = resPessoas?.dados?.dados || resPessoas?.dados || [];

                const opcoesFormatadas = listaPessoas.map((p) => ({
                    value: p.id,
                    label: p.razaoSocial || p.nomeFantasia || "Pessoa sem nome"
                }));
                setPessoasOptions(opcoesFormatadas);
            } catch (error) {
                console.error("Erro ao carregar pessoas:", error);
            }
        };
        carregarPerfisEPessoas();
    }, []);

    useEffect(() => {
        if (isEditing && idEdicao) {
            const carregarUsuario = async () => {
                setIsLoading(true);
                const response = await getUsuarioById(idEdicao);
                if (response.success && response.dados) {
                    reset({
                        nome: response.dados.nome,
                        login: response.dados.login,
                        idPerfilAcesso: response.dados.idPerfilAcesso,
                        idPessoa: response.dados.idPessoa || null,
                        ativo: response.dados.ativo,
                        senha: '',
                        confirmacaoSenha: ''
                    });
                } else {
                    toast.error("Erro ao carregar usuário.");
                    navigate('/usuario');
                }
                setIsLoading(false);
            };
            carregarUsuario();
        }
    }, [idEdicao, isEditing, reset, navigate]);

    const submit = async (dados: UsuarioFormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Salvando...");

        // Usando any para evitar erro de tipagem caso o idPessoa não esteja no UsuarioCadastroType
        const payload: any = {
            nome: dados.nome,
            login: dados.login,
            idPerfilAcesso: dados.idPerfilAcesso,
            idPessoa: dados.idPessoa,
            ativo: dados.ativo,
            ...(isEditing ? {} : { senha: dados.senha, confirmacaoSenha: dados.confirmacaoSenha })
        };

        const response = isEditing
            ? await putUsuario(idEdicao, payload)
            : await postUsuario(payload);

        if (response.success) {
            toast.update(toastId, { render: 'Salvo com sucesso!', type: "success", isLoading: false, autoClose: 2000 });
            navigate('/usuario');
        } else {
            toast.update(toastId, { render: response.mensagem || "Erro ao salvar.", type: "error", isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    };

    const onSubmitPwd = async (vals: { senha: string; confirmacaoSenha: string }) => {
        setPwdError(null);
        if (vals.senha !== vals.confirmacaoSenha) return setPwdError('As senhas não coincidem');

        setIsLoading(true);
        const toastId = toast.loading('Atualizando senha...');
        const response = await patchAlterarSenha({ id: idEdicao!, senha: vals.senha, confirmacaoSenha: vals.confirmacaoSenha });

        if (response.success) {
            toast.update(toastId, { render: 'Senha alterada!', type: 'success', isLoading: false, autoClose: 2000 });
            setPwdModalOpen(false);
            resetPwd();
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-full bg-slate-50 p-4 md:p-8 flex flex-col gap-6 font-sans">
            <div className="flex justify-between items-center">
                <PageHeader
                    title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    subtitle={isEditing ? 'Atualize os dados de acesso' : 'Cadastre as credenciais do novo usuário'}
                />
                <div className="flex gap-2">
                    {isEditing && (
                        <Button variant="outline" className="bg-white border-yellow-500 text-yellow-600 hover:bg-yellow-50" onClick={() => setPwdModalOpen(true)}>
                            <FaKey className="mr-2" size={14} /> Alterar senha
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6 border border-slate-100">
                <form id="usuarioForm" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Nome Completo *</label>
                        <input
                            {...register('nome', { required: 'O nome é obrigatório' })}
                            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            disabled={isLoading}
                            placeholder="Ex: João Silva"
                        />
                        {errors.nome && <span className="text-red-500 text-xs mt-1 block">{errors.nome.message}</span>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Login / Usuário *</label>
                        <input
                            {...register('login', { required: 'O login é obrigatório' })}
                            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            disabled={isLoading}
                            placeholder="Ex: joao.silva"
                        />
                        {errors.login && <span className="text-red-500 text-xs mt-1 block">{errors.login.message}</span>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Perfil de Acesso *</label>

                        <SelectFilter
                            options={perfisAcesso.map(p => ({ value: p.id, label: p.descricao }))}
                            value={watch("idPerfilAcesso") || ""}
                            onChange={(val) => setValue("idPerfilAcesso", val, { shouldValidate: true })}
                            placeholder="Selecione um perfil..."
                            isDisabled={isLoading}
                        />

                        <input
                            type="hidden"
                            {...register('idPerfilAcesso', { required: 'O perfil de acesso é obrigatório' })}
                        />

                        {errors.idPerfilAcesso && <span className="text-red-500 text-xs mt-1 block">{errors.idPerfilAcesso.message}</span>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Pessoa Vinculada (Opcional)</label>
                        <SelectFilter
                            options={pessoasOptions}
                            value={watch("idPessoa") || ""}
                            onChange={(val) => setValue("idPessoa", val === "" ? null : val)}
                            placeholder="Selecione uma pessoa..."
                        />
                    </div>

                    {!isEditing && (
                        <>
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <label className="text-sm font-semibold text-slate-700 block mb-1">Senha *</label>
                                <input
                                    type="password"
                                    {...register('senha', { required: 'Defina uma senha' })}
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                />
                            </div>
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <label className="text-sm font-semibold text-slate-700 block mb-1">Confirmar Senha *</label>
                                <input
                                    type="password"
                                    {...register('confirmacaoSenha', { required: 'Confirme a senha' })}
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                />
                            </div>
                        </>
                    )}
                </form>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => navigate('/usuario')} type="button">
                    <FaTimes className="mr-2" /> Cancelar
                </Button>
                <Button form="usuarioForm" type="submit" variant="default" size="lg" isLoading={isLoading}>
                    <FaSave className="mr-2" /> {isEditing ? 'Atualizar Usuário' : 'Salvar Usuário'}
                </Button>
            </div>

            <SideModal isOpen={isPwdModalOpen} onClose={() => setPwdModalOpen(false)}>
                <SideModal.Header onClose={() => setPwdModalOpen(false)}>
                    Alterar Senha
                </SideModal.Header>

                <form onSubmit={handlePwdSubmit(onSubmitPwd)} className="flex-1 flex flex-col overflow-hidden">
                    <SideModal.Body>
                        <p className="text-sm text-slate-500 mb-5">
                            Defina uma nova senha para este usuário.
                        </p>

                        {pwdError && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 font-medium mb-4">
                                {pwdError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Nova Senha</label>
                                <input
                                    type="password"
                                    {...registerPwd('senha', { required: true })}
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    {...registerPwd('confirmacaoSenha', { required: true })}
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </SideModal.Body>

                    <SideModal.Footer>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setPwdModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Confirmar Alteração
                        </Button>
                    </SideModal.Footer>
                </form>
            </SideModal>
        </div>
    );
}