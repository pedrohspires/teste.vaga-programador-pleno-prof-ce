import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Formulario from '../components/formulario';
import { Button } from '../components/ui/button';
import useDebounce from '../hooks/useDebounce';
import { postAuthLogin, type loginFormType, type loginType } from '../services/auth';

export default function Login() {
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<loginType>();
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (dados: loginFormType) => {
    const process = toast.loading("Salvando...");
    setIsLoading(true);

    const payload: loginType = {
      login: dados.login,
      senha: dados.senha
    }
    const response = await postAuthLogin(payload);
    if (response.success) {
      toast.update(process, { render: 'Login realizado com sucesso!', type: "success", isLoading: false, autoClose: 3000 });
      navigate('/')
    } else {
      console.log(response.mensagem)
      toast.update(process, { render: response.mensagem || "Erro desconhecido", type: "error", isLoading: false, autoClose: 3000 });
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo</h1>
            <p className="text-gray-600 mt-2">Dermatologista - Sistema</p>
          </div>

          <Formulario onSubmit={handleSubmit(useDebounce(submit, 500))}>
            <Formulario.InputText
              control={control}
              name='login'
              title='Login'
              disabled={isLoading}
            />

            <Formulario.InputSenha
              control={control}
              name='senha'
              title='Senha'
              disabled={isLoading}
            />

            <Button type='submit' variant="success" size={"lg"} isLoading={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Formulario>
        </div>
        <div className="text-center mt-6 text-gray-600 text-xs">
          <p>© {new Date().getFullYear()} DERMAONLINE. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}