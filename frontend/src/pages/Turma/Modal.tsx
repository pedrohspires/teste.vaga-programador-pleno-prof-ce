import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Tabela from '../../components/data-display/tabela';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/ui/pageHeader';
import SideModal from '../../components/ui/sideModal';
import { AppContext } from '../../context/appContext';
import { deleteAlunoTurma, getAlunoTurmaListagem, postAlunoTurma, type alunoTurmaFormType, type alunoTurmaType } from '../../services/alunoTurma';
import { getTurmaById, postTurma, putTurma, type addOrUpdateTurmaType, type turmaFormType } from '../../services/turma';
import TableDropdown from '../../templates/TableDropdown';
import SelectAluno from '../../templates/selects/AlunoSelect';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number | null;
    updateList: () => void;
}

export default function ModalTurma({ open, setOpen, id, updateList }: Props) {
    const { dadosUsuarioLogado } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<turmaFormType>();
    const { control: controlAluno, reset: resetAluno, getValues: getValuesAluno } = useForm<alunoTurmaFormType>();
    const [alunos, setAlunos] = useState<Array<alunoTurmaType>>([]);

    useEffect(() => {
        if (open && id) {
            setValueById();
            carregarAlunosTurma()
        }
    }, [open, id]);

    const setValueById = async () => {
        if (!id) return;

        setIsLoading(true);
        const response = await getTurmaById(id);
        if (response.success && response.dados) {
            reset({
                descricao: response.dados?.descricao,
            });
        } else {
            toast.error("Erro ao carregar turma.");
        }
        setIsLoading(false);
    }

    const carregarAlunosTurma = async () => {
        if (!id) return;

        setIsLoading(true);
        const toastId = toast.loading('Carregando alunos...');

        const response = await getAlunoTurmaListagem(id);

        if (response.success) {
            setAlunos(response.dados || []);
            toast.dismiss();
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    };

    const submit = async (vals: turmaFormType) => {
        setIsLoading(true);
        const toastId = toast.loading('Salvando...');

        const payload: addOrUpdateTurmaType = {
            descricao: vals.descricao,
            id_professor: dadosUsuarioLogado?.id || 0
        }
        const response = !!id ? await putTurma(id, payload) : await postTurma(payload);

        if (response.success) {
            toast.update(toastId, { render: "Item salvo com sucesso", type: 'success', isLoading: false, autoClose: 2000 });
            setOpen(false);
            reset();
            updateList();
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    };

    const handleAdicionarAluno = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Adicionando aluno...");

        const idAluno = getValuesAluno("aluno")?.value;
        const response = await postAlunoTurma({
            aluno: idAluno || 0,
            turma: id || 0
        });
        if (response.success) {
            toast.update(toastId, { render: "Aluno adicionado", type: 'success', isLoading: false, autoClose: 2000 });
            carregarAlunosTurma();
            resetAluno({});
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    }

    const handleRemoverAluno = async (idAlunoTurma: number) => {
        setIsLoading(true);
        const toastId = toast.loading("Removendo aluno...");

        const response = await deleteAlunoTurma(idAlunoTurma);
        if (response.success) {
            toast.update(toastId, { render: "Aluno removido", type: 'success', isLoading: false, autoClose: 2000 });
            carregarAlunosTurma();
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    }

    return (
        <SideModal isOpen={open} onClose={() => setOpen(false)}>
            <SideModal.Header onClose={() => setOpen(false)}>
                {id ? "Editar Turma" : "Nova Turma"}
            </SideModal.Header>

            <SideModal.Body>
                <Formulario onSubmit={handleSubmit(submit)}>
                    <Formulario.InputText
                        control={control}
                        name='descricao'
                        title='Descrição'
                    />
                </Formulario>

                {!!id && (
                    <div className='pt-8'>
                        <PageHeader
                            title='Alunos da turma'
                            subtitle='Gestão de turma'
                        />

                        <div className='flex gap-4 items-end pb-4'>
                            <div className='flex-1'>
                                <SelectAluno
                                    control={controlAluno}
                                    name='aluno'
                                    title='Aluno'
                                />
                            </div>

                            <div>
                                <Button onClick={handleAdicionarAluno} variant={"success"} size={"md"} className='py-3'>
                                    + Adicionar
                                </Button>
                            </div>
                        </div>

                        <Tabela>
                            <Tabela.Header>
                                <Tabela.Header.Row>
                                    <Tabela.Header.Row.Cell>Nome</Tabela.Header.Row.Cell>
                                    <Tabela.Header.Row.Cell className="text-right w-24">Ações</Tabela.Header.Row.Cell>
                                </Tabela.Header.Row>
                            </Tabela.Header>
                            <Tabela.Body>
                                {alunos.length === 0 ? (
                                    <Tabela.Body.Row>
                                        <Tabela.Body.Row.Cell colSpan={5} className="p-12 text-center text-slate-500">
                                            Nenhum aluno cadastrado para essa turma.
                                        </Tabela.Body.Row.Cell>
                                    </Tabela.Body.Row>
                                ) : (
                                    alunos.map(u => (
                                        <Tabela.Body.Row key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <Tabela.Body.Row.Cell className='font-medium text-slate-800'>{u.nome_aluno}</Tabela.Body.Row.Cell>
                                            <Tabela.Body.Row.Cell className="text-right">
                                                <TableDropdown>
                                                    <TableDropdown.Option handleClick={() => handleRemoverAluno(u.id)}>
                                                        <FaTrash className='fill-red-500 mr-2' /> Remover
                                                    </TableDropdown.Option>
                                                </TableDropdown>
                                            </Tabela.Body.Row.Cell>
                                        </Tabela.Body.Row>
                                    ))
                                )}
                            </Tabela.Body>
                        </Tabela>
                    </div>
                )}
            </SideModal.Body>

            <SideModal.Footer>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    isLoading={isLoading}
                    onClick={handleSubmit(submit)}
                >
                    Salvar
                </Button>
            </SideModal.Footer>
        </SideModal>
    )
}
