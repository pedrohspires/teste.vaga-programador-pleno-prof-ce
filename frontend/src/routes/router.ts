import { createBrowserRouter } from 'react-router'
import AppContextComponent from '../context/appContext'
import MainLayout from '../layouts/mainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'

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
                ],
            }
        ],
    },
])

export default rotas