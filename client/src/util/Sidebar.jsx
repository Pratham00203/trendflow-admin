import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import DownArrowImg from '../assets/images/down-arrow.png'
import { useContext } from "react";
import AdminContext from "../context/AdminContext";

export default function Sidebar() {
    const [showMenu, setShowMenu] = useState(false);
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login')
    }

    return <>
        <aside >
            <div className="sidebar">
                <div className="sidebar-head">
                    <h1>TrendFlow.</h1>
                    <p>Hello, <span>{admin.username}</span></p>
                </div>
                <div className="sidebar-menu d-flex flex-col">
                    <div className="menu-option">
                        <Link to='/dashboard'>
                            Dashboard
                        </Link>
                    </div>
                    <div className="menu-option ">
                        <button className="btn d-flex align-center" style={{ gap: "8px" }} onClick={() => setShowMenu(!showMenu)}>
                            Admin Management
                            <img src={DownArrowImg} />
                        </button>
                        <ul className={`flex-col ${showMenu ? "active" : ""}`}>
                            <li>&middot; <Link to="/admin/create">Create admin</Link></li>
                            <li>&middot; <Link to="/update/me">Update your account</Link></li>
                            <li>&middot; <Link to="/admins/all">Get all admins</Link></li>
                        </ul>
                    </div>
                    <div className="menu-option">
                        <Link to="/reports">
                            Reports Management
                        </Link>
                    </div>
                    <div className="logout-btn menu-option">
                        <button className="btn" onClick={logout}>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </aside>
    </>
}