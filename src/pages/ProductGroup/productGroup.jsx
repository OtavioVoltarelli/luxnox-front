import './productGroup.css';
import api from '../../axiosConfig';
import { useState, useEffect } from "react";
import Select from 'react-select'
import Modal from "../../components/Modal/modal";
import { useProductGroupData } from '../../hooks/useProductGroupsData';
import { useProductGroupMutate } from '../../hooks/useProductGroupMutate';

const ProductGroup = () => {
    const [modo, setModo] = useState("register");
    const [productGroup, setProductGroup] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedProductGroup, setSelectedProductGroup] = useState(null); // Inicializado como null
    const { data, isLoading } = useProductGroupData();
    const { mutate, isSuccess, isError } = useProductGroupMutate();

    useEffect(() => {
        if (selectedProductGroup) {
            setProductGroup(selectedProductGroup.name);
        }
    }, [selectedProductGroup]);

    const register = async () => {
        if (!productGroup.trim()) 
            return setModalMessage("Digite um nome para o grupo!"), setModalVisible(true);

        const data = {
            name: productGroup
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Grupo cadastrado com sucesso!");
            setModalVisible(true);
            setProductGroup("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar grupo! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!productGroup.trim()) return setModalMessage("Digite um nome para o grupo!");

        try {
            const response = await api.put(`/product-group/${selectedProductGroup.id}`, 
                { name: productGroup });

            setModalMessage("Grupo editado com sucesso!");
            setProductGroup(""); // limpa o campo
            setModalVisible(true);
            setSelectedProductGroup(null); // limpa o grupo selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar grupo.");
        }
    };

    const del = async () => {
        try {
            const response = await api.delete(`/product-group/${selectedProductGroup.id}`, {});

            setModalMessage("Grupo excluído com sucesso!");
            setModalVisible(true);
            setSelectedProductGroup(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir grupo.");
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
                        <h4>Cadastrar grupo</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: motor"
                            value={productGroup}
                            onChange={(e) => setProductGroup(e.target.value)}
                        /> <br />
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedProductGroup && (
                    <article>
                        <h4>Editar grupo</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: motor"
                            value={productGroup}  // se houver valor no productGroup o sitema vai usar
                            onChange={(e) => setProductGroup(e.target.value)} // Atualiza o productGroup ao digitar
                        /> <br />
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedProductGroup && (
                    <article>
                        <h4>Excluir grupo</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: motor"
                            value={selectedProductGroup.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar grupos de produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="productGroup"
                                options={data ? data.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedProductGroup ? { value: selectedProductGroup.id, label: selectedProductGroup.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedProductGroup(data.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um grupo"
                            />
                        </div>

                        {/* Exibe informações do grupo selecionado */}
                        {selectedProductGroup && (
                            <section className="selected-product-group">
                                <h4>Detalhes do Grupo Selecionado</h4>
                                <p><strong>Nome:</strong> {selectedProductGroup.name}</p>
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

export default ProductGroup;
