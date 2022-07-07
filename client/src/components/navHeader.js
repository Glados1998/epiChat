import React from 'react';
import {Link} from 'react-router-dom';

const Nav = () => {
    return (
        <header>
            <nav className={"navbar navbar-expand-lg navbar-dark bg-dark p-4"}>
                <div className={"container-fluid"}>
                    <Link to={"/"} className={"navbar-brand"}>Epichat</Link>
                    <div className={"navbar-nav"}>
                        <Link to="/" className={"nav-link"}>Home</Link>
                        <Link to="/chat" className={"nav-link"}>Chat</Link>
                        <Link to="/About" className={"nav-link"}>About Epichat</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Nav;