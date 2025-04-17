import Navbar from "../components/navbar/navbar";
import { useState } from "react";
import './mainLayout.css'

function MainLayout({ children }) {
    const [menuWidth, setMenuWidth] = useState("70px"); 

    return (
        <div className="layout">
            <Navbar setMenuWidth={setMenuWidth} /> 
            <main className="content" style={{ marginLeft: menuWidth }}>
                {children}
            </main>
        </div>
    );
}


export default MainLayout;