import type { ChildrenType } from '../../services/global'

function PageTitle({ title, subtitle, children }: { title: string, subtitle?: string } & ChildrenType) {
    return (
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default PageTitle