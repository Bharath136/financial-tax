import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BiLogIn } from 'react-icons/bi';
import { IoReorderThreeSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import AuthContext from '../../AuthContext/AuthContext';
import EditModal from '../../SweetPopup/sweetPopup';
import logo from '../../Assets/logo7.png'
import './header.css';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const Header = ({ setShowNav }) => {
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null)
    const [activeUser, setActiveUser] = useState('')
    const [profile, setProfile] = useState('');
    const [randomColor, setRandomColor] = useState('#03A9F4')
    const currentUser = getUserData()

    const token = getToken()
    const profileBg = localStorage.getItem('profileBg')

    useEffect(() => {
        if (currentUser) {
            const fullName = `${currentUser.first_name} ${currentUser.last_name}`
            setActiveUser(fullName)
            setProfile(currentUser.first_name[0]+currentUser.last_name[0])
            setShowNav(false)
            setRandomColor(profileBg);
        }
    }, [currentUser, setShowNav, profileBg]);

    const handleEditClick = (id) => {
        setProfileId(id)
        setIsEditModalOpen(!isEditModalOpen);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { id: '1', to: '/', text: 'HOME' },
        { id: '2', to: '/about', text: 'ABOUT US' },
        { id: '3', to: '/services', text: 'SERVICES' },
        { id: '4', to: '/contact', text: 'CONTACT' },
    ];    

    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeSidebar, showNav } = value;
                const toggleSidebar = () => {
                    changeSidebar();
                };

                return (
                    <div>
                        <Navbar
                            fixed="top"
                            className={token ? 'navbar-container-login' : 'navbar-container'}
                            expand="lg"
                            variant="dark"
                          
                        >
                            <div className="container-fluid">
                                <Navbar.Brand>
                                    <NavLink to="/" className='logo-link'>
                                    <img src={logo} alt='logo' className='logo-image'/>
                                    </NavLink>
                                </Navbar.Brand>
                                {token && 
                                <div className='d-block d-md-none d-flex align-items-center ml-2'>
                                    <div className='d-flex align-items-center' onClick={() => handleEditClick(currentUser.user_id)} style={{ cursor: 'pointer' }}>
                                        <div className='profile'  style={{ backgroundColor: `${randomColor}`  }}>
                                            <label style={{ cursor: 'pointer' }}>{profile}</label>
                                        </div>
                                            <label style={{ cursor: 'pointer' }} className='profile-name'><strong>{activeUser}</strong></label>
                                    </div>
                                <button className='d-block d-md-none three-dots align-items-center' style={{marginLeft:'10px'}} title='Close' onClick={toggleSidebar}>
                                            <IoReorderThreeSharp size={28} />
                                </button>
                                </div>}
                                {token && <Navbar.Toggle aria-controls="navbarSupportedContent" id="navbar-toggle" className='d-none d-md-block d-lg-none' />}
                                {token && <Navbar.Collapse id="navbarSupportedContent" >
                                    <div className="w-100 d-flex align-items-start justify-content-lg-end">
                                        <Nav className="ml-auto">
                                            <div className='d-flex align-items-center' onClick={() => handleEditClick(currentUser.user_id)} style={{ cursor: 'pointer' }}>
                                                <div className='profile'  style={{backgroundColor:`${randomColor}` }}>
                                                    <label style={{ cursor: 'pointer' }}>{profile}</label>
                                                </div>
                                                <label style={{ cursor: 'pointer' }} className='profile-name'><strong>{activeUser}</strong></label>
                                            </div>
                                            <button className='d-none d-lg-block three-dots align-items-center' style={{ marginLeft: '10px' }} title='Close' onClick={toggleSidebar}>
                                                <IoReorderThreeSharp size={28} />
                                            </button>
                                        </Nav>
                                    </div>
                                </Navbar.Collapse>}


                                {showNav && <Navbar.Toggle aria-controls="navbarSupportedContent" id="navbar-toggle" />}
                                {showNav && <Navbar.Collapse id="navbarSupportedContent" >
                                    <div className="w-100 d-flex align-items-start justify-content-lg-end">
                                        <Nav className="ml-auto">
                                            {navLinks.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    to={link.to}
                                                    className={`nav-link ${link.to === currentPath ? 'active-nav' : ''}`}
                                                >
                                                    {link.text}
                                                </Link>
                                                
                                            ))}

                                            <NavLink to='/accounts/login' className="auth-button ml-2 d-flex align-items-center pl-2 pr-2 pt-0 pb-0">
                                                <BiLogIn /><span className="nav-span">Login</span>
                                            </NavLink>
                                        </Nav>
                                    </div>
                                </Navbar.Collapse>}
                            </div>



                            <EditModal
                                isOpen={isEditModalOpen}
                                onRequestClose={handleEditModalClose}
                                profileId={profileId}
                                isEditable={true}
                                handleOpenClick={handleEditClick}
                            />
                        </Navbar>
                    </div>
                )
            }}
        </AuthContext.Consumer>
    );
};

export default Header;
