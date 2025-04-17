import './firm.css'
import axios from 'axios';
import { useState, useEffect } from "react";
import Select from 'react-select'
import CONFIG from "../../config";
import Modal from "../../components/Modal/modal";
import { useFirmData } from '../../hooks/useFirmData';
import { useFirmMutate } from '../../hooks/useFirmMutate';

const Firm = () => {
    const [modo, setModo] = useState("register");
    const [firm, setFirm] = useState({
        name: "",
        cnpj: "",
        contact: "",
        email: "",
        url: "",
        firmType: "",
        street: "",
        neighborhood: "",
        houseNumber: "",
        uf: "",
        city: "",
        zipCode: "",
        complement: "", 
    });
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedFirm, setSelectedFirm] = useState(null); // Inicializado como null
    const { data, isLoading } = useFirmData();
    const { mutate, isSuccess, isError } = useFirmMutate();


    const handleChange = (e) => {
        const { name, value } = e.target; // pega o nome e o valor do campo que foi alterado
        setFirm((prevFirm) => ({
            ...prevFirm, // mantem os valores anteriores
            [name]: value, // atualiza apenas o campo específico que foi alterado
        }));
    };
    
    
    useEffect(() => {
        if (selectedFirm) {
            setFirm(selectedFirm);
        }
    }, [selectedFirm]);


    const register = async () => {
        if (Object.values(firm).some(value => !value.trim())) 
            return setModalMessage("Preencha todos os campos!"), setModalVisible(true);

        mutate(firm)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Empresa cadastrado com sucesso!");
            setModalVisible(true);
            setFirm("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar empresa! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        // if (Object.values(firm).some(value => !value.trim())) 
        //     return setModalMessage("Preencha todos os campos!");

        try {
            const response = await axios.put(`${CONFIG.API_URL}/firm/${selectedFirm.id}`, firm);

            setModalMessage("Empresa editado com sucesso!");
            setFirm(""); // limpa o campo
            setModalVisible(true);
            setSelectedFirm(null); // limpa a empresa selecionada
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar empresa.");
        }
    };

    const del = async () => {
        try {
            const response = await axios.delete(`${CONFIG.API_URL}/firm/${selectedFirm.id}`, {});

            setModalMessage("Empresa excluído com sucesso!");
            setModalVisible(true);
            setSelectedFirm(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir empresa.");
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
        <main className="firm-container">
            <h2>EMPRESAS</h2>

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
                        <h4>Cadastrar empresa</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            name='name'
                            type="text"
                            value={firm.name}
                            onChange={handleChange}
                        />
                        <label htmlFor="cnpj">CNPJ: </label>
                        <input
                            id='cnpj'
                            name='cnpj'
                            type="text"
                            placeholder="Ex: 99.999.999/9999-99"
                            value={firm.cnpj}
                            onChange={handleChange}
                        />
                        <label htmlFor="street">Rua: </label>
                        <input
                            id='street'
                            name='street'
                            type="text"
                            value={firm.street}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="houseNumber">Número: </label>
                        <input
                            id='houseNumber'
                            name='houseNumber'
                            type="text"
                            value={firm.houseNumber}
                            onChange={handleChange}
                        />
                        <label htmlFor="uf">Estado: </label>
                        <input
                            id='uf'
                            name='uf'
                            type="text"
                            placeholder='ex: sp'
                            value={firm.uf}
                            onChange={handleChange}
                            maxLength='2'
                        />
                        <label htmlFor="city">Cidade: </label>
                        <input
                            id='city'
                            name='city'
                            type="text"
                            placeholder='ex: São Paulo'
                            value={firm.city}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="neighborhood">Bairro: </label>
                        <input
                            id='neighborhood'
                            name='neighborhood'
                            type="text"
                            value={firm.neighborhood}
                            onChange={handleChange}
                        />
                        <label htmlFor="zipCode">CEP: </label>
                        <input
                            id='zipCode'
                            name='zipCode'
                            type="text"
                            placeholder='ex: 99999999'
                            value={firm.zipCode}
                            onChange={handleChange}
                        />
                        <label htmlFor="complement">Complemento: </label>
                        <input
                            id='complement'
                            name='complement'
                            type="text"
                            value={firm.complement}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="contact">Telefone: </label>
                        <input
                            id='contact'
                            name='contact'
                            type="text"
                            placeholder='ex: (99)99999-9999'
                            value={firm.contact}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="email">E-mail: </label>
                        <input
                            id='email'
                            name='email'
                            type="text"
                            value={firm.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="url">URL: </label>
                        <input
                            id='url'
                            name='url'
                            type="text"
                            value={firm.url}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="firmType">Tipo: </label>
                        <select
                            id='firmType'
                            name='firmType'
                            type="text"
                            placeholder='São Paulo'
                            value={firm.firmType}
                            onChange={handleChange}
                        >
                            <option value="">Selecione o tipo da empresa</option>
                            <option value="WORKSHOP">Oficina</option>
                            <option value="STORE">Autopeça</option>
                            <option value="MOTOBOY">Motoboy</option>
                        </select>

                        <br/>
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedFirm && (
                    <article>
                        <h4>Editar empresa</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            name='name'
                            type="text"
                            value={firm.name}
                            onChange={handleChange}
                        />
                        <label htmlFor="cnpj">CNPJ: </label>
                        <input
                            id='cnpj'
                            name='cnpj'
                            type="text"
                            placeholder="Ex: 99.999.999/9999-99"
                            value={firm.cnpj}
                            onChange={handleChange}
                        />
                        <label htmlFor="street">Rua: </label>
                        <input
                            id='street'
                            name='street'
                            type="text"
                            value={firm.street}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="houseNumber">Número: </label>
                        <input
                            id='houseNumber'
                            name='houseNumber'
                            type="text"
                            value={firm.houseNumber}
                            onChange={handleChange}
                        />
                        <label htmlFor="uf">Estado: </label>
                        <input
                            id='uf'
                            name='uf'
                            type="text"
                            placeholder='ex: sp'
                            value={firm.uf}
                            onChange={handleChange}
                            maxLength='2'
                        />
                        <label htmlFor="city">Cidade: </label>
                        <input
                            id='city'
                            name='city'
                            type="text"
                            placeholder='ex: São Paulo'
                            value={firm.city}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="neighborhood">Bairro: </label>
                        <input
                            id='neighborhood'
                            name='neighborhood'
                            type="text"
                            value={firm.neighborhood}
                            onChange={handleChange}
                        />
                        <label htmlFor="zipCode">CEP: </label>
                        <input
                            id='zipCode'
                            name='zipCode'
                            type="text"
                            placeholder='ex: 99999999'
                            value={firm.zipCode}
                            onChange={handleChange}
                        />
                        <label htmlFor="complement">Complemento: </label>
                        <input
                            id='complement'
                            name='complement'
                            type="text"
                            value={firm.complement}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="contact">Telefone: </label>
                        <input
                            id='contact'
                            name='contact'
                            type="text"
                            placeholder='ex: (99)99999-9999'
                            value={firm.contact}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="email">E-mail: </label>
                        <input
                            id='email'
                            name='email'
                            type="text"
                            value={firm.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="url">URL: </label>
                        <input
                            id='url'
                            name='url'
                            type="text"
                            value={firm.url}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="firmType">Tipo: </label>
                        <select
                            id='firmType'
                            name='firmType'
                            type="text"
                            value={firm.firmType}
                            onChange={handleChange}
                        >
                            <option value="">Selecione o tipo da empresa</option>
                            <option value="WORKSHOP">Oficina</option>
                            <option value="STORE">Autopeça</option>
                            <option value="MOTOBOY">Motoboy</option>
                        </select>
                        <br />
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedFirm && (
                    <article>
                        <h4>Excluir empresa</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: motor"
                            value={selectedFirm.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar empresas</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="firm"
                                options={data ? data.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedFirm ? { value: selectedFirm.id, label: selectedFirm.name } : null}
                                styles={customStyles}
                                isSearchable
                                placeholder="Selecione um empresa"
                                onChange={(selected) => {
                                    const firm = data.find(pg => pg.id === selected.value);
                                    setSelectedFirm(firm)
                                }}
                            />
                        </div>

                        {/* Exibe informações da empresa selecionada */}
                        {selectedFirm && (
                            <section className="selected-firm">
                                <h4>Detalhes da Empresa Selecionado</h4>
                                <p><strong>Nome:</strong> {selectedFirm.name}</p>
                                <p><strong>cnpj:</strong> {selectedFirm.cnpj}</p>
                                <p><strong>Rua:</strong> {selectedFirm.street}</p>
                                <p><strong>Número:</strong> {selectedFirm.houseNumber}</p>
                                <p><strong>Estado:</strong> {selectedFirm.uf}</p>
                                <p><strong>Cidade:</strong> {selectedFirm.city}</p>
                                <p><strong>Bairro:</strong> {selectedFirm.neighborhood}</p>
                                <p><strong>CEP:</strong> {selectedFirm.zipCode}</p>
                                <p><strong>Complemento:</strong> {selectedFirm.complement}</p>
                                <p><strong>Telefone:</strong> {selectedFirm.contact}</p>
                                <p><strong>E-mail:</strong> {selectedFirm.email}</p>
                                <p><strong>URL:</strong> {selectedFirm.url}</p>
                                <p><strong>Tipo:</strong> {selectedFirm.firmType}</p>
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

export default Firm;
