import './Manufacturer.css';
import api from '../../axiosConfig';
import { useState, useEffect } from "react";
import Select from 'react-select'
import Modal from "../../components/Modal/modal";
import { useManufacturerData } from '../../hooks/useManufacturerData';
import { useManufacturerMutate } from '../../hooks/useManufacturerMutate';

const Manufacturer = () => {
    const [modo, setModo] = useState("register");
    const [manufacturer, setManufacturer] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedManufacturer, setSelectedManufacturer] = useState(null); // Inicializado como null
    const { data, isLoading } = useManufacturerData();
    const { mutate, isSuccess, isError } = useManufacturerMutate();

    useEffect(() => {
        if (selectedManufacturer) {
            setManufacturer(selectedManufacturer.name);
        }
    }, [selectedManufacturer]);

    const register = async () => {
        if (!manufacturer.trim()) 
            return setModalMessage("Digite um nome para a fabricante!"), setModalVisible(true);

        const data = {
            name: manufacturer
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Fabricante cadastrada com sucesso!");
            setModalVisible(true);
            setManufacturer("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar fabricante! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const editGroup = async () => {
        if (!manufacturer.trim()) return setModalMessage("Digite um nome para a fabricante!");

        try {
            const response = await api.put(`/manufacture/${selectedManufacturer.id}`, 
                { name: manufacturer });

            setModalMessage("Fabricante editado com sucesso!");
            setManufacturer(""); // limpa o campo
            setModalVisible(true);
            setSelectedManufacturer(null); // limpa a fabricante selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar fabricante.");
        }
    };

    const deleteGroup = async () => {
        try {
            const response = await api.delete(`/manufacture/${selectedManufacturer.id}`, {});

            setModalMessage("Fabricante excluído com sucesso!");
            setModalVisible(true);
            setSelectedManufacturer(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir fabricante.");
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
        <main className="manufacturer-container">
            <h2>FABRICANTES DE PRODUTOS</h2>

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
                        <h4>Cadastrar fabricante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: brasmeck"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                        /> <br />
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedManufacturer && (
                    <article>
                        <h4>Editar fabricante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: brasmeck"
                            value={manufacturer}  // se houver valor no manufacturer o sitema vai usar
                            onChange={(e) => setManufacturer(e.target.value)} // Atualiza o manufacturer ao digitar
                        /> <br />
                        <button onClick={editGroup}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedManufacturer && (
                    <article>
                        <h4>Excluir fabricante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: brasmeck"
                            value={selectedManufacturer.name} readOnly /> <br />
                        <button className="delete-button" onClick={deleteGroup}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar fabricantes de produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="manufacturer"
                                options={data ? data.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedManufacturer ? { value: selectedManufacturer.id, label: selectedManufacturer.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedManufacturer(data.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um fabricante"
                            />
                        </div>

                        {/* Exibe informações da fabricante selecionado */}
                        {selectedManufacturer && (
                            <section className="selected-manufacturer">
                                <h4>Detalhes do Fabricante Selecionado</h4>
                                <p><strong>Nome:</strong> {selectedManufacturer.name}</p>
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

export default Manufacturer;
