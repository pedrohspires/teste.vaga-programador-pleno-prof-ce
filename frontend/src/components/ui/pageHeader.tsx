import { type ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="text-left w-full md:w-auto">
                <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 text-xs md:text-sm mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="w-full md:w-auto grid grid-cols-1 min-[400px]:grid-cols-2 md:flex md:flex-row gap-2 md:gap-3">
                    {actions}
                </div>
            )}
            
        </div>
    );
}