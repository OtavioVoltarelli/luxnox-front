import './baseVehicle.css';
import api from '../../axiosConfig';
import { useState, useEffect } from "react";
import Select from 'react-select'
import Modal from "../../components/Modal/modal";
import { useBaseVehicleData } from '../../hooks/useBaseVehicleData';
import { useBaseVehicleMutate } from '../../hooks/useBaseVehicleMutate';
import { useAutomakerData } from '../../hooks/useAutomakerData';


const BaseVehicle = () => {
    const [modo, setModo] = useState("register");
    const [baseVehicle, setBaseVehicle] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedBaseVehicle, setSelectedBaseVehicle] = useState(null); // Inicializado como null
    const [selectedAutomaker, setSelectedAutomaker] = useState(null); // Inicializado como null
    const { data: baseVehicles, isLoading: isLoadingBaseVehicles } = useBaseVehicleData();
    const { data: automakers, isLoading: isLoadingAutomakers } = useAutomakerData();
    const { mutate, isSuccess, isError } = useBaseVehicleMutate();

    useEffect(() => {
        if (selectedBaseVehicle) {
            setBaseVehicle(selectedBaseVehicle.name);
            setSelectedAutomaker(selectedBaseVehicle.automaker)
        }
    }, [selectedBaseVehicle]);

    const register = async () => {
        if (!baseVehicle.trim() || !selectedAutomaker) 
            return setModalMessage("Preencha todos os campos"), setModalVisible(true);

        const data = {
            name: baseVehicle,
            automakerId: selectedAutomaker.id
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Base de Veículo cadastrada com sucesso!");
            setModalVisible(true);
            setBaseVehicle("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar base de veículo! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!baseVehicle.trim() || !selectedAutomaker) 
            return setModalMessage("Preencha todos os campos"), setModalVisible(true);

        try {
            const response = await api.put(`/base-vehicle/${selectedBaseVehicle.id}`, 
                {   name: baseVehicle,
                    automakerId: selectedAutomaker.id
                });

            setModalMessage("Base de Veículo editada com sucesso!");
            setBaseVehicle(""); // limpa o campo
            setModalVisible(true);
            setSelectedBaseVehicle(null); // limpa o base de veículo selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar base de veículo.");
        }
    };

    const del = async () => {
        try {
            const response = await api.delete(`/base-vehicle/${selectedBaseVehicle.id}`, {});

            setModalMessage("Base de Veículo excluída com sucesso!");
            setModalVisible(true);
            setSelectedBaseVehicle(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir base de veículo.");
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
        <main className="product-group-container">
            <h2>BASE DE VEÍCULOS</h2>

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
                        <h4>Cadastrar base de veículo</h4>
                        <label htmlFor="name">Nome veículo: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: uno"
                            value={baseVehicle}
                            onChange={(e) => setBaseVehicle(e.target.value)}
                        /> <br />
                        <div className='select-container'>
                            <label htmlFor="automaker">Montadora: </label>
                            <Select
                                    id="automaker"
                                    options={automakers ? automakers.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={selectedAutomaker ? { value: selectedAutomaker.id, label: selectedAutomaker.name } : null}
                                    styles={customStyles}
                                    onChange={(selected) => setSelectedAutomaker(automakers.find(pg => pg.id === selected.value))}
                                    isSearchable
                                    placeholder="Selecione uma montadora"
                                />
                        </div>
                            <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedBaseVehicle && (
                    <article>
                        <h4>Editar base de veículo</h4>
                        <label htmlFor="name">Nome veículo: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: uno"
                            value={baseVehicle}  // se houver valor no baseVehicle o sitema vai usar
                            onChange={(e) => setBaseVehicle(e.target.value)} // Atualiza o baseVehicle ao digitar
                        /> <br />
                        <div className='select-container'>
                            <label htmlFor="automaker">Montadora: </label>
                            <Select
                                    id="automaker"
                                    options={automakers ? automakers.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={
                                        selectedAutomaker
                                            ? { value: selectedAutomaker.id, label: selectedAutomaker.name }
                                            : selectedBaseVehicle?.automaker
                                            ? { value: selectedBaseVehicle.automaker.id, label: selectedBaseVehicle.automaker.name}
                                            : null
                                        }
                                    styles={customStyles}
                                    onChange={(selected) => setSelectedAutomaker(automakers.find(pg => pg.id === selected.value))}
                                    isSearchable
                                    placeholder="Selecione uma montadora"
                                />
                        </div>
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedBaseVehicle && (
                    <article>
                        <h4>Excluir base de veículo</h4>
                        <label htmlFor="name">Nome veículo: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: uno"
                            value={selectedBaseVehicle.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar base de veículos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome veículo: </label>
                            <Select
                                id="baseVehicle"
                                options={baseVehicles ? baseVehicles.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedBaseVehicle ? { value: selectedBaseVehicle.id, label: selectedBaseVehicle.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedBaseVehicle(baseVehicles.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um base de veículo"
                            />
                        </div>

                        {/* Exibe informações do base de veículo selecionado */}
                        {selectedBaseVehicle && (
                            <section className="selected-base-vehicle">
                                <h4>Detalhes da Base de Veículo Selecionada</h4>
                                <p><strong>Montadora:</strong> {selectedBaseVehicle.automaker.name}</p>
                                <p><strong>Nome veículo:</strong> {selectedBaseVehicle.name}</p>
                            </section>
                        )}
                        {isLoadingBaseVehicles && <p>Carregando...</p>}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default BaseVehicle;
