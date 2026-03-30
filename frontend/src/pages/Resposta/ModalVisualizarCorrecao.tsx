import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import SideModal from '../../components/ui/sideModal';
import { type correcaoType } from '../../services/correcao';
import { getMeCorrecoesById } from '../../services/home';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number | null;
}

export default function ModalVisualizarCorrecao({ open, setOpen, id }: Props) {
    const [correcao, setCorrecao] = useState<correcaoType>();

    useEffect(() => {
        if (open && id)
            setValueById();
    }, [open, id]);

    const setValueById = async () => {
        if (!id) return;

        const response = await getMeCorrecoesById(id);
        if (response.success && response.dados) {
            setCorrecao(response.dados)
        } else {
            toast.error("Erro ao carregar correção.");
        }
    }

    return (
        <SideModal isOpen={open} onClose={() => setOpen(false)}>
            <SideModal.Header onClose={() => setOpen(false)}>
                Correção #{correcao?.id}
            </SideModal.Header>

            <SideModal.Body>
                <div>
                    <div>Atividade: {correcao?.resposta.titulo_atividade}</div>
                    <div>Resposta: {correcao?.resposta.conteudo_resposta}</div>
                    <div>Nota do professor: {correcao?.nota}</div>
                    <div>Comentários do professor: {correcao?.feedback}</div>
                </div>
            </SideModal.Body>

            <SideModal.Footer>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                >
                    Fechar
                </Button>
            </SideModal.Footer>
        </SideModal>
    )
}
