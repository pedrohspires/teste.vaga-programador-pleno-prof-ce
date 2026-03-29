import { createBrowserRouter } from 'react-router'
import AppContextComponent from '../context/appContext'
import MainLayout from '../layouts/mainLayout'
import Atividade from '../pages/Atividade'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Turma from '../pages/Turma'
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
                    {
                        path: '/turma',
                        Component: Turma,
                    },
                    {
                        path: '/atividade',
                        Component: Atividade,
                    },
                ],
            }
        ],
    },
])

export default rotas