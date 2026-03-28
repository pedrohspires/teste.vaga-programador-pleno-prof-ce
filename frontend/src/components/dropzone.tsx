import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { postArquivo, resolveArquivoPath } from '../services/arquivo';

type Props = {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    disabled?: boolean;
}

function CustomDropzone({ value, setValue, disabled }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (disabled) return;

        const file = acceptedFiles[0];
        if (!file) return;

        setLoading(true);
        const process = toast.loading("Enviando arquivo...");

        const formData = new FormData();
        formData.append("File", file);

        const response = await postArquivo(formData);
        if (response.success) {
            setValue(response.dados || "");
            toast.update(process, { render: "Arquivo enviado com sucesso", type: "success", isLoading: false, autoClose: 3000 });
        }
        else toast.update(process, { render: response.mensagem, type: "error", isLoading: false, autoClose: 3000 });

        setLoading(false);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, disabled: disabled || loading })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='w-full h-fit min-h-56 border-dashed border-2 rounded-md border-blue-300 grid place-items-center p-8 cursor-pointer'>
                {value
                    ? (
                        <img className='rounded-md' src={resolveArquivoPath(value)} />
                    ) : (
                        <div className='px-8 text-center flex flex-col items-center'>
                            <FaUpload className='size-10 text-blue-300' />
                            <p className='text-blue-950/75 font-semibold'>Upload de arquivos</p>
                            <p className='text-blue-950/45 font-semibold text-sm'>Clique ou arraste um arquivo até aqui para realizar o upload</p>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CustomDropzone