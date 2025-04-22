import './product.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import Select from 'react-select'
import CONFIG from "../../config";
import Modal from "../../components/Modal/modal";
import { useProductData } from '../../hooks/useProductData';
import { useProductMutate } from '../../hooks/useProductMutate';
import { useProductLineData } from '../../hooks/useProductLineData';
import { useManufacturerData } from '../../hooks/useManufacturerData';


const Product = () => {
    const [modo, setModo] = useState("register");
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedProduct, setSelectedProduct] = useState(null); // Inicializado como null
    const [selectedProductLine, setSelectedProductLine] = useState(null); // Inicializado como null
    const [selectedManufacturer, setSelectedManufacturer] = useState(null); // Inicializado como null
    const { data: products, isLoading: isLoadingProducts } = useProductData();
    const { data: productLines } = useProductLineData();
    const { data: manufacturers } = useManufacturerData();
    const { mutate, isSuccess, isError } = useProductMutate();

    useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct.name);
            setProductCode(selectedProduct.code);
            setSelectedProductLine(selectedProduct.productLine)
            setSelectedManufacturer(selectedProduct.manufacture)
        }
    }, [selectedProduct]);
    

    const register = async () => {
        if (!productName.trim() || !productName.trim() || !selectedProductLine || !selectedManufacturer) 
            return setModalMessage("Preencha todos os campos"), setModalVisible(true);

        const data = {
            code: productCode,
            name: productName,
            productLineId: selectedProductLine.id,
            manufactureId: selectedManufacturer.id
        }
        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Produto cadastrada com sucesso!");
            setModalVisible(true);
            setProductName("");
            setProductCode("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar produto! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        if (!productName.trim() || !productName.trim() || !selectedProductLine || !selectedManufacturer) 
            return setModalMessage("Preencha todos os campos!"), setModalVisible(true);

        try {
            const response = await axios.put(`${CONFIG.API_URL}/product/${selectedProduct.id}`, 
                {   
                    code: productCode,
                    name: productName,
                    productLineId: selectedProductLine.id,
                    manufactureId: selectedManufacturer.id
                });

            setModalMessage("Produto editada com sucesso!");
            setProductName(""); // limpa o campo
            setProductCode(""); // limpa o campo
            setModalVisible(true);
            setSelectedProduct(null); // limpa o produto selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar produto.");
        }
    };

    const del = async () => {
        try {
            const response = await axios.delete(`${CONFIG.API_URL}/product/${selectedProduct.id}`, {});

            setModalMessage("Produto excluído com sucesso!");
            setModalVisible(true);
            setSelectedProduct(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir produto.");
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: "300px",
            margin: "7px",
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
            <h2>PRODUTOS</h2>

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
                        <h4>Cadastrar produto</h4>
                        <label htmlFor="code">Código: </label>
                        <input
                            id='code'
                            type="text"
                            placeholder="Ex: 40.505-JV"
                            value={productCode}
                            onChange={(e) => setProductCode(e.target.value)}
                        /> 
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: junta da tampa da valvula"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />

                            <div className='all-select-container'>
                                <div className='select-container'>
                                    <label htmlFor="productLine">Linha: </label>
                                    <Select
                                            id="productLine"
                                            options={productLines ? productLines.map(pl => ({ value: pl.id, label: pl.name })) : []}
                                            value={selectedProductLine ? { value: selectedProductLine.id, label: selectedProductLine.name } : null}
                                            styles={customStyles}
                                            onChange={(selected) => setSelectedProductLine(productLines.find(pl => pl.id === selected.value))}
                                            isSearchable
                                            placeholder="Selecione uma linha"
                                        />
                                </div>
                                <div className='select-container'>
                                    <label htmlFor="manufacturer">Fabricante: </label>
                                    <Select
                                            id="manufacturer"
                                            options={manufacturers ? manufacturers.map(pl => ({ value: pl.id, label: pl.name })) : []}
                                            value={selectedManufacturer ? { value: selectedManufacturer.id, label: selectedManufacturer.name } : null}
                                            styles={customStyles}
                                            onChange={(selected) => setSelectedManufacturer(manufacturers.find(pl => pl.id === selected.value))}
                                            isSearchable
                                            placeholder="Selecione um fabricante"
                                        />
                                </div>
                            </div>

                            <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedProduct && (
                    <article>
                        <h4>Editar produto</h4>
                        <label htmlFor="code">Código: </label>
                        <input
                            id='code'
                            type="text"
                            placeholder="Ex: 40.505-JV"
                            value={productCode}  
                            onChange={(e) => setProductCode(e.target.value)} // atualiza o product ao digitar
                        />
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Ex: junta da tampa da valvula"
                            value={productName}  
                            onChange={(e) => setProductName(e.target.value)} // atualiza o product ao digitar
                        /> <br />
                        <div className='all-select-container'>
                            <div className='select-container'>
                                <label htmlFor="productLine">Linha: </label>
                                <Select
                                        id="productLine"
                                        options={productLines ? productLines.map(pl => ({ value: pl.id, label: pl.name })) : []}
                                        value={selectedProductLine ? { value: selectedProductLine.id, label: selectedProductLine.name } : null}
                                        styles={customStyles}
                                        onChange={(selected) => setSelectedProductLine(productLines.find(pl => pl.id === selected.value))}
                                        isSearchable
                                        placeholder="Selecione uma linha"
                                    />
                            </div>
                            <div className='select-container'>
                                <label htmlFor="manufacturer">Fabricante: </label>
                                <Select
                                        id="manufacturer"
                                        options={manufacturers ? manufacturers.map(pl => ({ value: pl.id, label: pl.name })) : []}
                                        value={selectedManufacturer ? { value: selectedManufacturer.id, label: selectedManufacturer.name } : null}
                                        styles={customStyles}
                                        onChange={(selected) => setSelectedManufacturer(manufacturers.find(pl => pl.id === selected.value))}
                                        isSearchable
                                        placeholder="Selecione um fabricante"
                                    />
                            </div>
                        </div>

                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedProduct && (
                    <article>
                        <h4>Excluir produto</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: juntas de motor"
                            value={selectedProduct.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="product"
                                options={products ? products.map(pg => ({ value: pg.id, label: `${pg.code} - ${pg.name}` })) : []}
                                value={selectedProduct ? { value: selectedProduct.id, label: `${selectedProduct.code} - ${selectedProduct.name}` } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedProduct(products.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um produto"
                            />
                        </div>

                        {/* Exibe informações do produto selecionado */}
                        {selectedProduct && (
                            <section className="selected-product">
                                <h4>Detalhes do Produto Selecionado</h4>
                                <p><strong>Código:</strong> {productCode}</p>
                                <p><strong>Nome:</strong> {productName}</p>
                                <p><strong>Linha:</strong> {selectedProductLine?.name}</p>
                                <p><strong>Grupo:</strong> {selectedProductLine?.productGroup?.name}</p>
                                <p><strong>Fabricante:</strong> {selectedManufacturer?.name}</p>
                            </section>
                        )}
                        {isLoadingProducts && <p>Carregando...</p>}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default Product;
