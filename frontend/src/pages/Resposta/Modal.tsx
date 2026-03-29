import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';
import SideModal from '../../components/ui/sideModal';
import { AppContext } from '../../context/appContext';
import { getRespostaByAtividadeAluno, patchResposta, postResposta, type addOrUpdateRespostaType, type respostaFormType } from '../../services/resposta';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number | null;
    idAtividade: number | null;
    updateList: () => void;
}

export default function ModalResposta({ open, setOpen, idAtividade, updateList }: Props) {
    const { dadosUsuarioLogado } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<respostaFormType>();
    const [idResposta, setIdResposta] = useState<number>(0);

    useEffect(() => {
        if (open && idAtividade)
            setValueByAtividadeId();
        else if (!open) reset({ conteudo_resposta: "" });
    }, [open, idAtividade]);

    const setValueByAtividadeId = async () => {
        if (!idAtividade) return;

        setIsLoading(true);
        const response = await getRespostaByAtividadeAluno(idAtividade, dadosUsuarioLogado?.tipo === "ALUNO" ? dadosUsuarioLogado.id : 0);
        if (response.success && response.dados) {
            setIdResposta(response.dados.id);
            reset({
                conteudo_resposta: response.dados?.conteudo_resposta,
            });
        }
        setIsLoading(false);
    }

    const submit = async (vals: respostaFormType) => {
        setIsLoading(true);
        const toastId = toast.loading('Salvando...');

        const payload: addOrUpdateRespostaType = {
            aluno: dadosUsuarioLogado?.id || 0,
            atividade: idAtividade || 0,
            conteudo_resposta: vals.conteudo_resposta,
        }
        const response = !!idResposta ? await patchResposta(idResposta, payload) : await postResposta(payload);

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
                Resposta
            </SideModal.Header>

            <SideModal.Body>
                <Formulario onSubmit={handleSubmit(submit)}>
                    <Formulario.TextArea
                        control={control}
                        name='conteudo_resposta'
                        title='Resposta'
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
