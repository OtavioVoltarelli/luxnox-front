import './productLine.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import Select from 'react-select'
import CONFIG from "../../config";
import Modal from "../../components/Modal/modal";
import { useProductLineData } from '../../hooks/useProductLineData';
import { useProductLineMutate } from '../../hooks/useProductLineMutate';
import { useProductGroupData } from '../../hooks/useProductGroupsData';


const ProductLine = () => {
    const [modo, setModo] = useState("register");
    const [productLine, setProductLine] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedProductLine, setSelectedProductLine] = useState(null); // Inicializado como null
    const [selectedProductGroup, setSelectedProductGroup] = useState(null); // Inicializado como null
    const { data: productLines, isLoading: isLoadingProductLines } = useProductLineData();
    const { data: productGroups, isLoading: isLoadingProductGroups } = useProductGroupData();
    const { mutate, isSuccess, isError } = useProductLineMutate();

    useEffect(() => {
        if (selectedProductLine) {
            setProductLine(selectedProductLine.name);
            setSelectedProductGroup(selectedProductLine.productGroup)
        }
    }, [selectedProductLine]);

    const register = async () => {
        if (!productLine.trim() || !selectedProductGroup) 
            return setModalMessage("Preencha todos os campos"), setModalVisible(true);

        const data = {
            name: productLine,
            productGroupId: selectedProductGroup.id
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Linha cadastrada com sucesso!");
            setModalVisible(true);
            setProductLine("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar linha! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!productLine.trim() || !selectedProductGroup) 
            return setModalMessage("Preencha todos os campos"), setModalVisible(true);

        try {
            const response = await axios.put(`${CONFIG.API_URL}/product-line/${selectedProductLine.id}`, 
                {   name: productLine,
                    productGroupId: selectedProductGroup.id
                });

            setModalMessage("Linha editada com sucesso!");
            setProductLine(""); // limpa o campo
            setModalVisible(true);
            setSelectedProductLine(null); // limpa o linha selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar linha.");
        }
    };

    const del = async () => {
        try {
            const response = await axios.delete(`${CONFIG.API_URL}/product-line/${selectedProductLine.id}`, {});

            setModalMessage("Linha excluído com sucesso!");
            setModalVisible(true);
            setSelectedProductLine(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir linha.");
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
            <h2>LINHA DE PRODUTOS</h2>

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
                        <h4>Cadastrar linha</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: juntas de motor"
                            value={productLine}
                            onChange={(e) => setProductLine(e.target.value)}
                        /> <br />
                        <div className='select-container'>
                            <label htmlFor="productGroup">Grupo: </label>
                            <Select
                                    id="productGroup"
                                    options={productGroups ? productGroups.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={selectedProductGroup ? { value: selectedProductGroup.id, label: selectedProductGroup.name } : null}
                                    styles={customStyles}
                                    onChange={(selected) => setSelectedProductGroup(productGroups.find(pg => pg.id === selected.value))}
                                    isSearchable
                                    placeholder="Selecione um grupo"
                                />
                        </div>
                            <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedProductLine && (
                    <article>
                        <h4>Editar linha</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: juntas de motor"
                            value={productLine}  // se houver valor no productLine o sitema vai usar
                            onChange={(e) => setProductLine(e.target.value)} // Atualiza o productLine ao digitar
                        /> <br />
                        <div className='select-container'>
                            <label htmlFor="productGroup">Grupo: </label>
                            <Select
                                    id="productGroup"
                                    options={productGroups ? productGroups.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={
                                        selectedProductGroup
                                            ? { value: selectedProductGroup.id, label: selectedProductGroup.name }
                                            : selectedProductLine?.productGroup
                                            ? { value: selectedProductLine.productGroup.id, label: selectedProductLine.productGroup.name}
                                            : null
                                        }
                                    styles={customStyles}
                                    onChange={(selected) => setSelectedProductGroup(productGroups.find(pg => pg.id === selected.value))}
                                    isSearchable
                                    placeholder="Selecione um grupo"
                                />
                        </div>
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedProductLine && (
                    <article>
                        <h4>Excluir linha</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: juntas de motor"
                            value={selectedProductLine.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar linhas de produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="productLine"
                                options={productLines ? productLines.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedProductLine ? { value: selectedProductLine.id, label: selectedProductLine.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedProductLine(productLines.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um linha"
                            />
                        </div>

                        {/* Exibe informações do linha selecionado */}
                        {selectedProductLine && (
                            <section className="selected-product-line">
                                <h4>Detalhes do Linha Selecionada</h4>
                                <p><strong>Grupo:</strong> {selectedProductLine.productGroup.name}</p>
                                <p><strong>Nome:</strong> {selectedProductLine.name}</p>
                            </section>
                        )}
                        {isLoadingProductLines && <p>Carregando...</p>}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default ProductLine;
