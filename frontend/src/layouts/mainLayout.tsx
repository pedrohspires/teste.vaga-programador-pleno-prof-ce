import { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import CustomDropdown from '../components/ui/dropdown';
import DynamicIcon from '../components/ui/dynamic-icon';
import { AppContext } from '../context/appContext';
import { authLogout } from '../services/auth';
import { getMenu, type menuItemType } from '../services/menu';
import { classNames } from '../utils/classNames';

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { dadosUsuarioLogado, logout } = useContext(AppContext);

    const [pesquisa, setPesquisa] = useState<string>("");

    const [menuOpen, setMenuOpen] = useState<boolean>(() => {
        const saved = localStorage.getItem("menuOpen") === "TRUE";
        return window.innerWidth < 768 ? false : saved;
    });

    const [showToggleMenuBtn, setShowToggleMenuBtn] = useState<boolean>(() => {
        const saved = localStorage.getItem("menuOpen") === "TRUE";
        return window.innerWidth < 768 ? true : !saved;
    });
    const [menuItens, setMenuItens] = useState<menuItemType[]>([]);
    const [menuPesquisa, setMenuPesquisa] = useState<menuItemType[]>([]);

    useEffect(() => {
        carregarMenu();
    }, [location.pathname]);

    async function carregarMenu() {
        const pathSegments = window.location.pathname.split("/");
        const path = pathSegments.length > 1 && pathSegments[1] !== "" ? pathSegments[1] : "";

        try {
            const response = await getMenu(path);

            if (response.status === 200) {
                const itensDoMenu = (response.dados as unknown as menuItemType[]) || [];

                setMenuItens(itensDoMenu);
                setMenuPesquisa(itensDoMenu);
            } else {
                toast.error(response.mensagem);
            }
        } catch (error) {
            console.error("Erro ao carregar o menu:", error);
        }
    }

    useEffect(() => {
        localStorage.setItem("menuOpen", menuOpen ? "TRUE" : "FALSE");

        let timeout: ReturnType<typeof setTimeout>;

        if (!menuOpen) {
            timeout = setTimeout(() => setShowToggleMenuBtn(true), 300);
        } else {
            timeout = setTimeout(() => setShowToggleMenuBtn(false), 0);
        }

        return () => clearTimeout(timeout);
    }, [menuOpen]);

    function toggleMenuOpen() {
        setMenuOpen(!menuOpen);
    }

    const handleSair = async () => {
        try {
            await authLogout();
        } catch (error) {
            console.error("Erro na API durante o logout", error);
        } finally {
            if (logout) logout();

            const preferenciaMenu = localStorage.getItem("menuOpen");

            localStorage.clear();
            sessionStorage.clear();

            if (preferenciaMenu) {
                localStorage.setItem("menuOpen", preferenciaMenu);
            }

            navigate('/login');
        }
    };

    const btnMenuElement = (
        <div className='cursor-pointer p-2' onClick={toggleMenuOpen}>
            <MdMenu className='size-8 fill-blue-950' />
        </div>
    );
    console.log(menuItens)
    return (
        <div className='w-full h-[100dvh] flex overflow-hidden relative'>

            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <nav
                className={classNames(
                    'bg-white drop-shadow-md transition-[width] ease-in-out duration-300 flex flex-col h-full absolute md:relative z-50 overflow-hidden',
                    menuOpen ? "w-[80vw] sm:w-80" : "w-0"
                )}
            >
                <div className='w-full h-12 flex justify-between items-center border-b border-b-white/25'>
                    <span className='text-blue-950 px-4 font-bold text-lg whitespace-nowrap'>DERMAONLINE</span>
                    {btnMenuElement}
                </div>

                <div className='w-full p-4'>
                    <input
                        id="login"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder={"Pesquisa"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>

                <div className='w-full max-w-full space-y-2 px-4 pt-4 flex flex-col justify-between h-full pb-4 overflow-y-auto'>
                    <div className='w-full'>
                        {!pesquisa
                            ? menuItens?.map((menuItem, index) => (
                                <MenuItem menuItem={menuItem} key={menuItem.path + "_" + index} />
                            ))
                            : menuPesquisa?.filter(x => x.descricao.toLowerCase().includes(pesquisa.toLowerCase())).map((menuItem, index) => (
                                <MenuItem menuItem={menuItem} key={menuItem.path + "_" + index} />
                            ))}
                    </div>

                    <MenuItem
                        menuItem={{
                            descricao: "Configurações",
                            ativo: false,
                            icone: "FaCog",
                            path: "/Configuracoes"
                        }}
                    />
                </div>
            </nav>

            <div className='flex-1 flex flex-col min-w-0 h-full'>
                <nav className='w-full h-12 bg-white flex justify-between items-center pr-4 shadow-sm z-10 relative'>
                    {showToggleMenuBtn ? btnMenuElement : <div />}

                    <div>
                        <CustomDropdown>
                            <CustomDropdown.Trigger>
                                <div className='flex gap-2 items-center font-semibold text-blue-600 cursor-pointer'>
                                    <span className='text-blue-950 uppercase font-semibold text-sm hidden sm:block'>{dadosUsuarioLogado?.nome}</span>
                                    <div className='w-9 aspect-square rounded-full bg-blue-100 grid place-items-center'>
                                        <FaUser className='fill-blue-400' />
                                    </div>
                                </div>
                            </CustomDropdown.Trigger>
                            <CustomDropdown.Content>
                                <div className='min-w-[14rem] flex gap-2 items-center font-semibold text-blue-600 p-2'>
                                    <Button className="w-full" variant={"outline"} onClick={handleSair}>Sair</Button>
                                </div>
                            </CustomDropdown.Content>
                        </CustomDropdown>
                    </div>
                </nav>
                <div className='bg-slate-50 flex-1 overflow-y-auto w-full'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

function MenuItem({ menuItem }: { menuItem: menuItemType }) {
    return (
        <Link
            to={menuItem.path}
            className={classNames(
                'w-full flex items-center gap-2 p-2 px-4 rounded-lg cursor-pointer text-blue-950 mb-1 font-semibold transition-colors',
                menuItem.ativo ? "bg-blue-100 hover:bg-blue-200" : "bg-transparent hover:bg-blue-50" // Troquei bg-white por bg-transparent para evitar bugs visuais se o fundo mudar
            )}
        >
            <DynamicIcon name={menuItem.icone} />
            <span>{menuItem.descricao}</span>
        </Link>
    )
}