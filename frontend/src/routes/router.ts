import { createBrowserRouter } from 'react-router'
import AppContextComponent from '../context/appContext'
import MainLayout from '../layouts/mainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Usuario from '../pages/Usuario'
import UsuarioForm from '../pages/Usuario/form'

const rotas = createBrowserRouter([
    {
        path: '/',
        Component: AppContextComponent,
        children: [
            {
                path: '/login',
                Component: Login,
            },
            {
                path: '/',
                Component: MainLayout,
                children: [
                    {
                        path: '/',
                        Component: Home,
                    },
                    {
                        path: '/usuario',
                        Component: Usuario,
                    },
                    {
                        path: '/usuario/form',
                        Component: UsuarioForm,
                    },
                ],
            }
        ],
    },
])

export default rotas