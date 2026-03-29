import { format } from 'date-fns';
import React, { type ReactNode } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, type Control } from 'react-hook-form';
import type { ChildrenType } from '../services/global';

type Props = {
    onSubmit: React.SubmitEventHandler<HTMLFormElement>;
    children: ReactNode;
}

type BasePropsInput = {
    title: string;
    name: string;
    control: Control<any>;
    disabled?: boolean;
}

function Formulario({ onSubmit, children }: Props) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
        </form>
    )
}

Formulario.Label = ({ children, htmlFor }: ChildrenType & { htmlFor: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">{children}</label>
)

Formulario.InputText = ({ name, control, title, disabled, type, placeholder }: BasePropsInput & { type?: React.HTMLInputTypeAttribute, placeholder?: string }) => {
    const { field: { value, onChange } } = useController({ name, control });

    return (
        <div>
            <div>
                <Formulario.Label htmlFor={name}>{title}</Formulario.Label>
            </div>
            <input
                id={name}
                value={value}
                type={type}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                disabled={disabled}
            />
        </div>
    )
}

Formulario.InputSenha = ({ name, control, title, disabled, placeholder }: BasePropsInput & { placeholder?: string }) => {
    const { field: { value, onChange } } = useController({ name, control });

    return (
        <div>
            <div>
                <Formulario.Label htmlFor={name}>{title}</Formulario.Label>
            </div>
            <input
                id={name}
                value={value}
                type="password"
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                disabled={disabled}
            />
        </div>
    )
}

Formulario.TextArea = ({
    name,
    control,
    title,
    disabled,
    placeholder
}: BasePropsInput & { placeholder?: string }) => {
    const { field: { value, onChange } } = useController({ name, control });

    return (
        <div>
            <div>
                <Formulario.Label htmlFor={name}>{title}</Formulario.Label>
            </div>

            <textarea
                id={name}
                value={value}
                rows={4}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                disabled={disabled}
            />
        </div>
    );
}

Formulario.DatePicker = ({
    name,
    control,
    title,
    disabled,
    placeholder
}: BasePropsInput & { placeholder?: string }) => {
    const {
        field: { value, onChange }
    } = useController({ name, control });

    return (
        <div>
            <div>
                <Formulario.Label htmlFor={name}>{title}</Formulario.Label>
            </div>

            <DatePicker
                selected={value ? new Date(value) : null}
                onChange={(date: Date | null) => onChange(date ? format(date, "yyyy-MM-dd") : null)}
                placeholderText={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                disabled={disabled}
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
};

export default Formulario