import { Badge } from '../../components/ui/badge'
import type { tiposUsuarioType } from '../../services/usuario'

export default function TipoUsuarioBadge({ tipo }: { tipo: tiposUsuarioType }) {
    return (
        <>
            <Badge variant={tipo === "PROFESSOR" ? "success" : "warning"} size="sm">
                {tipo === "PROFESSOR" ? "Professor" : "Aluno"}
            </Badge>
        </>
    )
}
