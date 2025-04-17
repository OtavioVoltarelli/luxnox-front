import './engine.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import Select from 'react-select'
import CONFIG from "../../config";
import Modal from "../../components/Modal/modal";
import { useEngineData } from '../../hooks/useEngineData';
import { useEngineMutate } from '../../hooks/useEngineMutate';

const Engine = () => {
    const [modo, setModo] = useState("register");
    const [engine, setEngine] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedEngine, setSelectedEngine] = useState(null); // Inicializado como null
    const { data, isLoading } = useEngineData();
    const { mutate, isSuccess, isError } = useEngineMutate();

    useEffect(() => {
        if (selectedEngine) {
            setEngine(selectedEngine.name);
        }
    }, [selectedEngine]);

    const register = async () => {
        if (!engine.trim()) 
            return setModalMessage("Digite um nome para o motor!"), setModalVisible(true);

        const data = {
            name: engine
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Motor cadastrado com sucesso!");
            setModalVisible(true);
            setEngine("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar motor! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!engine.trim()) return setModalMessage("Digite um nome para o motor!");

        try {
            const response = await axios.put(`${CONFIG.API_URL}/engine/${selectedEngine.id}`, 
                { name: engine });

            setModalMessage("Motor editado com sucesso!");
            setEngine(""); // limpa o campo
            setModalVisible(true);
            setSelectedEngine(null); // limpa o motor selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar motor.");
        }
    };

    const del = async () => {
        try {
            const response = await axios.delete(`${CONFIG.API_URL}/engine/${selectedEngine.id}`, {});

            setModalMessage("Motor excluído com sucesso!");
            setModalVisible(true);
            setSelectedEngine(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir motor.");
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
        <main className="engine-container">
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
                        <h4>Cadastrar motor</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: 1.0"
                            value={engine}
                            onChange={(e) => setEngine(e.target.value)}
                        /> <br />
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedEngine && (
                    <article>
                        <h4>Editar motor</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: 1.0"
                            value={engine}  // se houver valor no engine o sitema vai usar
                            onChange={(e) => setEngine(e.target.value)} // Atualiza o engine ao digitar
                        /> <br />
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedEngine && (
                    <article>
                        <h4>Excluir motor</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: 1.0"
                            value={selectedEngine.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar motors de produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="engine"
                                options={data ? data.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedEngine ? { value: selectedEngine.id, label: selectedEngine.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedEngine(data.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um motor"
                            />
                        </div>

                        {/* Exibe informações do motor selecionado */}
                        {selectedEngine && (
                            <section className="selected-engine">
                                <h4>Detalhes do Motor Selecionado</h4>
                                <p><strong>Nome:</strong> {selectedEngine.name}</p>
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

export default Engine;
