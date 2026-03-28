import React, { useState } from 'react'
import SideModal from '../../components/ui/sideModal'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { patchAlterarSenha } from '../../services/usuario';
import Formulario from '../../components/formulario';
import { Button } from '../../components/ui/button';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number;
}

export default function ModalAlterarSenha({ open, setOpen, id }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<{ password: string }>();

    const submit = async (vals: { password: string }) => {
        setIsLoading(true);
        const toastId = toast.loading('Atualizando password...');
        const response = await patchAlterarSenha({ id: id, password: vals.password });

        if (response.success) {
            toast.update(toastId, { render: 'Senha alterada!', type: 'success', isLoading: false, autoClose: 2000 });
            setOpen(false);
            reset();
        } else {
            toast.update(toastId, { render: response.mensagem || 'Erro', type: 'error', isLoading: false, autoClose: 3000 });
        }
        setIsLoading(false);
    };

    return (
        <SideModal isOpen={open} onClose={() => setOpen(false)}>
            <SideModal.Header onClose={() => setOpen(false)}>
                Alterar Senha
            </SideModal.Header>

            <form onSubmit={handleSubmit(submit)} className="flex-1 flex flex-col overflow-hidden">
                <SideModal.Body>
                    <p className="text-sm text-slate-500 mb-5">
                        Defina uma nova senha para este usuário.
                    </p>

                    <div className="space-y-4">
                        <Formulario.InputSenha
                            control={control}
                            name='password'
                            title='Nova Senha'
                        />
                    </div>
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
                    >
                        Confirmar Alteração
                    </Button>
                </SideModal.Footer>
            </form>
        </SideModal>
    )
}
