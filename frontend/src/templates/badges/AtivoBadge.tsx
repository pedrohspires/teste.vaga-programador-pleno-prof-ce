import { Badge } from '../../components/ui/badge'

export default function AtivoBadge({ ativo }: { ativo: boolean }) {
    return (
        <>
            <Badge variant={ativo ? "success" : "danger"} size="sm">
                {ativo ? "Ativo" : "Inativo"}
            </Badge>
        </>
    )
}
