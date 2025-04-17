import './automaker.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import Select from 'react-select'
import CONFIG from "../../config";
import Modal from "../../components/Modal/modal";
import { useAutomakerData } from '../../hooks/useAutomakerData';
import { useAutomakerMutate } from '../../hooks/useAutomakerMutate';

const Automaker = () => {
    const [modo, setModo] = useState("register");
    const [automaker, setAutomaker] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedAutomaker, setSelectedAutomaker] = useState(null); // Inicializado como null
    const { data, isLoading } = useAutomakerData();
    const { mutate, isSuccess, isError } = useAutomakerMutate();

    useEffect(() => {
        if (selectedAutomaker) {
            setAutomaker(selectedAutomaker.name);
        }
    }, [selectedAutomaker]);

    const register = async () => {
        if (!automaker.trim()) 
            return setModalMessage("Digite um nome para o montadora!"), setModalVisible(true);

        const data = {
            name: automaker
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Montadora cadastrado com sucesso!");
            setModalVisible(true);
            setAutomaker("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar montadora! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!automaker.trim()) return setModalMessage("Digite um nome para o montadora!");

        try {
            const response = await axios.put(`${CONFIG.API_URL}/automaker/${selectedAutomaker.id}`, 
                { name: automaker });

            setModalMessage("Montadora editado com sucesso!");
            setAutomaker(""); // limpa o campo
            setModalVisible(true);
            setSelectedAutomaker(null); // limpa o montadora selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar montadora.");
        }
    };

    const del = async () => {
        try {
            const response = await axios.delete(`${CONFIG.API_URL}/automaker/${selectedAutomaker.id}`, {});

            setModalMessage("Montadora excluído com sucesso!");
            setModalVisible(true);
            setSelectedAutomaker(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir montadora.");
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: "300px",
            margin: "5px",
            height: "30px",
            backgroundColor: "#f0f0f0",
            borderColor: "grey", // cor da borda
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#888", // Cor ao passar o mouse
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "lightgrey" : "fff", // Cor da opção selecionada
            color: state.isSelected ? "black" : "#424242",
            "&:hover": {
                backgroundColor: "lightgrey",
                color: "black",
            },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "8px",
            overflow: "hidden",
        }),
    };

    return (
        <main className="automaker-container">
            <h2>GRUPO DE PRODUTOS</h2>

            {/* Botões de opções */}
            <section className="fields-section">
                <article className="options-article">
                    <button className={`options-button ${modo === "register" ? "active" : ""}`} onClick={() => setModo("register")}>
                        CADASTRAR
                    </button>
                    <button className={`options-button ${modo === "search" ? "active" : ""}`} onClick={() => setModo("search")}>
                        PESQUISAR
                    </button>
                    <button className={`options-button ${modo === "edit" ? "active" : ""}`} onClick={() => setModo("edit")}>
                        EDITAR
                    </button>
                    <button className={`options-button ${modo === "delete" ? "active" : ""}`} onClick={() => setModo("delete")}>
                        EXCLUIR
                    </button>
                </article>
            </section>

            {/* Formulário condicional */}
            <section className="form-section">
                {modo === "register" && (
                    <article>
                        <h4>Cadastrar montadora</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: fiat"
                            value={automaker}
                            onChange={(e) => setAutomaker(e.target.value)}
                        /> <br />
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedAutomaker && (
                    <article>
                        <h4>Editar montadora</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: fiat"
                            value={automaker}  // se houver valor no automaker o sitema vai usar
                            onChange={(e) => setAutomaker(e.target.value)} // Atualiza o automaker ao digitar
                        /> <br />
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedAutomaker && (
                    <article>
                        <h4>Excluir montadora</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: fiat"
                            value={selectedAutomaker.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar montadoras</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="automaker"
                                options={data ? data.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedAutomaker ? { value: selectedAutomaker.id, label: selectedAutomaker.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedAutomaker(data.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione uma montadora"
                            />
                        </div>

                        {/* Exibe informações da montadora selecionado */}
                        {selectedAutomaker && (
                            <section className="selected-automaker">
                                <h4>Detalhes da Montadora Selecionado</h4>
                                <p><strong>Nome:</strong> {selectedAutomaker.name}</p>
                            </section>
                        )}
                        {isLoading && <p>Carregando...</p>}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default Automaker;
