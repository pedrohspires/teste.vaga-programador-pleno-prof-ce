import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import SideModal from '../../components/ui/sideModal';
import { AppContext } from '../../context/appContext';
import { getAtividadeById, postAtividade, putAtividade, type addOrUpdateAtividadeType, type atividadeFormType } from '../../services/atividade';
import SelectTurma from '../../templates/selects/TurmaSelect';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number | null;
    updateList: () => void;
}

export default function ModalAtividade({ open, setOpen, id, updateList }: Props) {
    const { dadosUsuarioLogado } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<atividadeFormType>();

    useEffect(() => {
        if (open && id) {
            setValueById();
        }
    }, [open, id]);

    const setValueById = async () => {
        if (!id) return;

        setIsLoading(true);
        const response = await getAtividadeById(id);
        if (response.success && response.dados) {
            reset({
                descricao: response.dados?.descricao,
            });
        } else {
            toast.error("Erro ao carregar atividade.");
        }
        setIsLoading(false);
    }

    const submit = async (vals: atividadeFormType) => {
        setIsLoading(true);
        const toastId = toast.loading('Atualizando password...');

        const payloda: addOrUpdateAtividadeType = {
            titulo: vals.titulo,
            descricao: vals.descricao,
            data_entrega: vals.data_entrega,
            turma: vals.turma.value,
        }
        const response = !!id ? await putAtividade(id, payloda) : await postAtividade(payloda);

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

    return (
        <SideModal isOpen={open} onClose={() => setOpen(false)}>
            <SideModal.Header onClose={() => setOpen(false)}>
                {id ? "Editar Atividade" : "Nova Atividade"}
            </SideModal.Header>

            <SideModal.Body>
                <Formulario onSubmit={handleSubmit(submit)}>
                    <Formulario.InputText
                        control={control}
                        name='titulo'
                        title='Título'
                        disabled={isLoading}
                    />

                    <Formulario.TextArea
                        control={control}
                        name='descricao'
                        title='Descrição'
                        disabled={isLoading}
                    />

                    <Formulario.DatePicker
                        control={control}
                        name='data_entrega'
                        title='Data de entrega'
                        disabled={isLoading}
                    />

                    <SelectTurma
                        control={control}
                        name='turma'
                        title='Turma'
                        isDisabled={isLoading}
                    />
                </Formulario>
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
