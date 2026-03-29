import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import SideModal from '../../components/ui/sideModal';
import { getCorrecaoByResposta, postCorrecao, putCorrecao, type addOrUpdateCorrecaoType, type correcaoFormType } from '../../services/correcao';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    idResposta: number | null;
    updateList: () => void;
}

export default function ModalCorrecao({ open, setOpen, idResposta, updateList }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<correcaoFormType>();
    const [idCorrecao, setIdCorrecao] = useState<number>(0);

    useEffect(() => {
        if (open && idResposta)
            setValueByAtividadeId();
        else if (!open) reset({});
    }, [open, idResposta]);

    const setValueByAtividadeId = async () => {
        if (!idResposta) return;

        setIsLoading(true);
        const response = await getCorrecaoByResposta(idResposta);
        if (response.success && response.dados) {
            setIdCorrecao(response.dados.id);
            reset({
                nota: response.dados?.nota,
                feedback: response.dados?.feedback,
            });
        }
        setIsLoading(false);
    }

    const submit = async (vals: correcaoFormType) => {
        setIsLoading(true);
        const toastId = toast.loading('Salvando...');

        const payload: addOrUpdateCorrecaoType = {
            resposta: idResposta || 0,
            nota: vals.nota,
            feedback: vals.feedback,
        }
        const response = !!idCorrecao ? await putCorrecao(idCorrecao, payload) : await postCorrecao(payload);

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
                Correção
            </SideModal.Header>

            <SideModal.Body>
                <Formulario onSubmit={handleSubmit(submit)}>
                    <Formulario.InputText
                        control={control}
                        name='nota'
                        title='Nota'
                        disabled={isLoading}
                        type='number'
                    />

                    <Formulario.TextArea
                        control={control}
                        name='feedback'
                        title='Feedback'
                        disabled={isLoading}
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
