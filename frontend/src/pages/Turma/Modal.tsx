import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import SideModal from '../../components/ui/sideModal';
import { AppContext } from '../../context/appContext';
import { postTurma, putTurma, type addOrUpdateTurmaType, type turmaFormType } from '../../services/turma';

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

    const submit = async (vals: turmaFormType) => {
        setIsLoading(true);
        const toastId = toast.loading('Atualizando password...');

        const payloda: addOrUpdateTurmaType = {
            descricao: vals.descricao,
            id_professor: dadosUsuarioLogado?.id || 0
        }
        const response = !!id ? await putTurma(id, payloda) : await postTurma(payloda);

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
