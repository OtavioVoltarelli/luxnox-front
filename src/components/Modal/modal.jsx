import React, { useEffect } from "react";
import "./modal.css"; // Importando os estilos do Modal

const Modal = ({ message, isVisible, onClose }) => {
    // Fechar automaticamente o modal após 3 segundos
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose(); // Fecha o modal após 3 segundos
            }, 3000);

            return () => clearTimeout(timer); // Limpa o timer caso o modal seja fechado antes
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Modal;
