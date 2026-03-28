import { HttpStatusCode } from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import LoadingPage from '../components/loading-page';
import useDebounce from '../hooks/useDebounce';
import { authLogout, getAuthUsuarioLogado } from '../services/auth';
import type { usuarioLogadoType } from '../services/usuario';

type appContextType = {
    dadosUsuarioLogado: usuarioLogadoType | undefined;
    logout: () => void;
}
export const AppContext = createContext<appContextType>({} as any);

export default function AppContextComponent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [dadosUsuarioLogado, setDadosUsuarioLogado] = useState<usuarioLogadoType>();

    useEffect(() => {
        carregaDadosUsuarioLogado();
    }, []);

    useEffect(() => {
        carregaDadosUsuarioLogado();
    }, [location]);

    const carregaDadosUsuarioLogado = useDebounce(async () => {
        const response = await getAuthUsuarioLogado();
        setLoading(false);
        if (response.status === HttpStatusCode.Unauthorized && !window.location.pathname.includes("/login")) {
            logout();
            navigate("/login");
            return;
        }

        if (response.success) {
            if (window.location.pathname.includes("/login"))
                navigate("/");

            setDadosUsuarioLogado(response.dados);
            return;
        }

        if (response.mensagem && !window.location.pathname.includes("/login"))
            toast.error(response.mensagem);
    }, 500);

    const logout = useDebounce(async () => {
        const response = await authLogout();
        if (response.success) {
            localStorage.clear();
            navigate("/login");
        } else {
            if (response.status === HttpStatusCode.Unauthorized) {
                navigate("/login");
                return;
            }

            toast.error(response.mensagem);
        }
    }, 500);

    return (
        <AppContext.Provider value={{
            dadosUsuarioLogado,
            logout
        }}>
            {loading ? <LoadingPage /> : <Outlet />}
        </AppContext.Provider>
    )
}
