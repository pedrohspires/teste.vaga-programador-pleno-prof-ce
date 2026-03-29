import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FaKey } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/ui/pageHeader';
import { getUsuarioById, postUsuario, putUsuario, type addOrUpdateUsuarioType, type usuarioFormType } from '../../services/usuario';
import SelectTipoUsuario from '../../templates/selects/TipoUsuarioSelect';
import { optionsTipoUsuario } from '../../utils/constants';
import ModalAlterarSenha from './ModalAlterarSenha';

export default function UsuarioForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const idEdicao = location.state?.id;
    const isEditing = Boolean(idEdicao);

    const [isLoading, setIsLoading] = useState(false);

    const [modalAlterarSenhaOpen, setModalAlterarSenhaOpen] = useState(false);

    const { handleSubmit, control, reset } = useForm<usuarioFormType>({
        defaultValues: {
            nome: '',
            email: '',
            password: '',
            tipo: undefined,
        }
    });

    useEffect(() => {
        if (isEditing && idEdicao)
            carregarUsuario();
    }, [idEdicao, isEditing, reset, navigate]);

    const carregarUsuario = async () => {
        setIsLoading(true);
        const response = await getUsuarioById(idEdicao);
        if (response.success && response.dados) {
            reset({
                nome: response.dados?.nome,
                email: response.dados?.email,
                tipo: optionsTipoUsuario.find(x => x.value === response.dados?.tipo),
                password: '',
            });
        } else {
            toast.error("Erro ao carregar usuário.");
            navigate('/usuario');
        }
        setIsLoading(false);
    };

    const submit = async (dados: usuarioFormType) => {
        setIsLoading(true);
        const toastId = toast.loading("Salvando...");

        const payload: addOrUpdateUsuarioType = {
            nome: dados.nome,
            email: dados.email,
            tipo: dados.tipo.value,
            password: dados.password
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

    return (
        <div className="min-h-full bg-slate-50 p-4 md:p-8 flex flex-col gap-6 font-sans">
            <div className="flex justify-between items-center">
                <PageHeader
                    title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    subtitle={isEditing ? 'Atualize os dados de acesso' : 'Cadastre as credenciais do novo usuário'}
                />
                <div className="flex gap-2">
                    {isEditing && (
                        <Button variant="outline" className="bg-white border-yellow-500 text-yellow-600 hover:bg-yellow-50" onClick={() => setModalAlterarSenhaOpen(true)}>
                            <FaKey className="mr-2" size={14} /> Alterar password
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6 border border-slate-100">
                <Formulario onSubmit={handleSubmit(submit)}>
                    <Formulario.InputText
                        control={control}
                        name='nome'
                        title='Nome'
                        disabled={isLoading}
                    />

                    <Formulario.InputText
                        control={control}
                        name='email'
                        title='Email'
                        type='email'
                        disabled={isLoading}
                    />

                    <SelectTipoUsuario
                        control={control}
                        name='tipo'
                        title='Tipo de usuário'
                        isDisabled={isLoading}
                    />

                    {!isEditing && (
                        <>
                            <Formulario.InputSenha
                                control={control}
                                name='password'
                                title='Senha'
                                disabled={isLoading}
                            />
                        </>
                    )}

                </Formulario>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
                <div>
                    <Button type="button" variant="outline" className="w-auto px-6">
                        Cancelar
                    </Button>
                </div>

                <div>
                    <Button onClick={handleSubmit(submit)} variant="success" className="w-auto px-8" isLoading={isLoading}>
                        Salvar
                    </Button>
                </div>
            </div>

            <ModalAlterarSenha
                id={idEdicao}
                open={modalAlterarSenhaOpen}
                setOpen={setModalAlterarSenhaOpen}
            />
        </div>
    );
}