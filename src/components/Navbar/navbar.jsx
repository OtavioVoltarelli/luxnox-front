import './navbar.css';
import { useState } from "react";
import { Menu, LayoutDashboard, Handshake, Package, Car, Cog, ChevronDown, LogOut } from "lucide-react";
import HandleLogout from '../../logout';

const Navbar = ({ setMenuWidth }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState({
        clientes: false,
        produtos: false
    });

    const toggleMenu = () => {
        const newWidth = menuOpen ? "70px" : "250px";
        setMenuOpen(!menuOpen);
        setMenuWidth(newWidth);
    };

    const toggleSubmenu = (menu) => {
        setSubmenuOpen(prevState => ({
            ...prevState,
            [menu]: !prevState[menu]
        }));
    };

    return (
        <nav className={`side-menu ${menuOpen ? 'expanded' : ''}`}>
            <div className='btn-expand' onClick={toggleMenu}>
                <Menu color='white' cursor="pointer" size={28} />
            </div>
            <ul>
                <li className='menu-item'>
                    <a href="#">
                        <span className='icon'><LayoutDashboard color='white' size={28} /></span>
                        <span className='txt'>Dashboard</span>
                    </a>
                </li>

                <li className='menu-item' onClick={() => toggleSubmenu("clientes")}>
                    <a className="menu-toggle">
                        <span className='icon'><Handshake color='white' size={28} /></span>
                        <span className='txt'>Clientes</span>
                        <span className={`arrow ${submenuOpen.clientes ? 'open' : ''}`}><ChevronDown /></span>
                    </a>
                    <ul className={`submenu ${submenuOpen.clientes ? 'show' : ''}`}>
                        <li><a href="/clientes/empresas">Empresas</a></li>
                        <li><a href="/clientes/representantes">Representantes</a></li>
                    </ul>
                </li>

                <li className='menu-item' onClick={() => toggleSubmenu("produtos")}>
                    <a className="menu-toggle">
                        <span className='icon'><Package color='white' size={28} /></span>
                        <span className='txt'>Produtos</span>
                        <span className={`arrow ${submenuOpen.produtos ? 'open' : ''}`}><ChevronDown /></span>
                    </a>
                    <ul className={`submenu ${submenuOpen.produtos ? 'show' : ''}`}>
                        <li><a href="/produtos">Produtos</a></li>
                        <li><a href="/produtos/fabricantes">Fabricantes</a></li>
                        <li><a href="/produtos/linhas">Linhas</a></li>
                        <li><a href="/produtos/grupos">Grupos</a></li>
                    </ul>
                </li>

                <li className='menu-item' onClick={() => toggleSubmenu("veiculos")}>
                    <a className="menu-toggle">
                        <span className='icon'><Car color='white' size={28} /></span>
                        <span className='txt'>Veículos</span>
                        <span className={`arrow ${submenuOpen.veiculos ? 'open' : ''}`}><ChevronDown /></span>
                    </a>
                    <ul className={`submenu ${submenuOpen.veiculos ? 'show' : ''}`}>
                        <li><a href="/veiculos">Veiculos</a></li>
                        <li><a href="/veiculos/bases">Bases de Veículos</a></li>
                        <li><a href="/veiculos/montadoras">Montadoras</a></li>
                        <li><a href="/veiculos/motores">Motores</a></li>
                    </ul>
                </li>

                <li className='menu-item' onClick={() => toggleSubmenu("configuracoes")}>
                    <a className="menu-toggle">
                        <span className='icon'><Cog color='white' size={28} /></span>
                        <span className='txt'>Configurações</span>
                        <span className={`arrow ${submenuOpen.configuracoes ? 'open' : ''}`}><ChevronDown /></span>
                    </a>
                    <ul className={`submenu ${submenuOpen.configuracoes ? 'show' : ''}`}>
                        <li><a href="/associacao/produtos-similares">Produtos Similares</a></li>
                        <li><a href="/associacao/produtos-veiculos">Produtos / Veículos</a></li>
                    </ul>
                </li>
                    
                <button id='logout-button' onClick={HandleLogout}>
                    <span className='icon'><LogOut color='red' size={28} /></span>
                    <span id='logout' >Sair</span>
                </button>
                    
            </ul>
        </nav>
    );
};

export default Navbar;
