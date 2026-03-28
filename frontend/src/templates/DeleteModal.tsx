import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleConfirm: () => void;
}

export default function DeleteModal({ open, setOpen, handleConfirm }: Props) {
	return (
		<Modal isOpen={open} onClose={() => setOpen(false)} maxWidth="max-w-sm">
			<div className="p-6 text-center">
				<h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
				<p className="text-slate-500 mb-6">Tem certeza que deseja excluir este item?</p>
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						type="button"
					>
						Cancelar
					</Button>

					<Button
						variant="danger"
						onClick={handleConfirm}
						type="button"
					>
						Excluir
					</Button>
				</div>
			</div>
		</Modal>
	);
}