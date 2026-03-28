import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button'; // <-- Importando seu componente de botão
import { deleteUsuario } from '../../services/usuario';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
  onSuccess: () => void;
}

export default function UsuarioDeleteModal({ isOpen, onClose, id, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const response = await deleteUsuario(id);

      if ((response as any).status === 401) {
        navigate('/login');
        return;
      }

      if (!response.success) throw new Error(response.mensagem || 'Erro ao excluir');

      toast.success('Usuário excluído com sucesso');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao excluir usuário', err);
      toast.error('Erro ao excluir o usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
        <p className="text-slate-500 mb-6">Tem certeza que deseja excluir este usuário?</p>
        <div className="flex justify-center gap-2">
          
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
          </Button>

        </div>
      </div>
    </Modal>
  );
}