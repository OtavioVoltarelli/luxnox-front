import './user.css';
import api from '../../axiosConfig';
import { useState, useEffect, use } from "react";
import Select from 'react-select'
import Modal from "../../components/Modal/modal";
import { useUserData } from '../../hooks/useUserData';
import { useUserMutate } from '../../hooks/useUserMutate';
import { useFirmData } from '../../hooks/useFirmData';


const User = () => {
    const [modo, setModo] = useState("register");
    const [user, setUser] = useState({
        name: "",
        lastName: "",
        document: "",
        email: "",
        password: "",
        userType: "",
        firmId: null,
    });
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedUser, setSelectedUser] = useState(null); // Inicializado como null
    const [selectedFirm, setSelectedFirm] = useState(null); // Inicializado como null
    const { data: users, isLoading: isLoadingUsers } = useUserData();
    const { data: firms, isLoading: isLoadingFirms } = useFirmData();
    const { mutate, isSuccess, isError } = useUserMutate();

    const handleChange = (e) => {
        const { name, value } = e.target; // pega o nome e o valor do campo que foi alterado
        setUser((prevUser) => ({
            ...prevUser, // mantem os valores anteriores
            [name]: value, // atualiza apenas o campo específico que foi alterado
        }));
    };

    useEffect(() => {
        if (selectedUser) {
            setUser(prevUser => ({
                ...prevUser,
                ...selectedUser, 
                firmId: selectedUser.firm?.id || null // Garante que firmId seja setado corretamente
            }));
            setSelectedFirm(selectedUser.firm || null);
        }
    }, [selectedUser]);

    const register = async () => {
        // if (Object.values(user).some(value => !value.trim())) 
        //     return setModalMessage("Preencha todos os campos!"), setModalVisible(true);

        mutate(user)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Representante cadastrada com sucesso!");
            setModalVisible(true);
            setUser("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar representante! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        // if (!user.trim() || !selectedFirm) 
        //     return setModalMessage("Preencha todos os campos"), setModalVisible(true);
        console.log(user.firmId,)
        try {
            const response = await api.put(`/user/${selectedUser.id}`, user)

            setModalMessage("Representante editada com sucesso!");
            setUser(""); // limpa o campo
            setModalVisible(true);
            setSelectedUser(null); // limpa o representante selecionado
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar representante.");
        }
    };

    const del = async () => {
        try {
            const response = await api.delete(`/user/${selectedUser.id}`, {});

            setModalMessage("Representante excluído com sucesso!");
            setModalVisible(true);
            setSelectedUser(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir representante.");
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
            <h2>REPRESENTANTES</h2>

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
                        <h4>Cadastrar representante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            name='name'
                            type="text"
                            value={user.name}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="lastName">Sobrenome: </label>
                        <input
                            id='lastName'
                            name='lastName'
                            type="text"
                            value={user.lastName}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="document">CPF: </label>
                        <input
                            id='document'
                            name='document'
                            type="text"
                            placeholder="Ex: 999.999.999-99"
                            value={user.document}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="email">E-mail: </label>
                        <input
                            id='email'
                            name='email'
                            type="text"
                            value={user.email}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="password">Senha: </label>
                        <input
                            id='password'
                            name='password'
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="userType">Tipo: </label>
                        <select
                            id='userType'
                            name='userType'
                            type="text"
                            value={user.userType}
                            onChange={handleChange}
                        >
                            <option value="">Selecione o tipo do representante</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="REPRESENTATIVE">Representante</option>
                            <option value="MOTOBOY">Motoboy</option>
                        </select>
                        <br />
                        <div className='select-container'>
                            <label htmlFor="firm">Empresa: </label>
                            <Select
                                    id="firm"
                                    options={firms ? firms.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={selectedFirm ? { value: selectedFirm.id, label: selectedFirm.name } : null}
                                    styles={customStyles}
                                    onChange={(selected) => {
                                        const firm = firms.find(pg => pg.id === selected.value);
                                        setSelectedFirm(firm);
                                        setUser(prevUser => ({ ...prevUser, firmId: firm.id })); // atualiza firmId no user
                                    }}
                                    isSearchable
                                    placeholder="Selecione uma empresa"
                                />
                        </div>
                            <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedUser && (
                    <article>
                        <h4>Editar representante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input
                            id='name'
                            name='name'
                            type="text"
                            value={user.name}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="lastName">Sobrenome: </label>
                        <input
                            id='lastName'
                            name='lastName'
                            type="text"
                            value={user.lastName}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="document">CPF: </label>
                        <input
                            id='document'
                            name='document'
                            type="text"
                            placeholder="Ex: 999.999.999-99"
                            value={user.document}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="email">E-mail: </label>
                        <input
                            id='email'
                            name='email'
                            type="text"
                            value={user.email}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="password">Senha: </label>
                        <input
                            id='password'
                            name='password'
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                        /> 
                        <label htmlFor="userType">Tipo: </label>
                        <select
                            id='userType'
                            name='userType'
                            type="text"
                            placeholder='São Paulo'
                            value={user.userType}
                            onChange={handleChange}
                        >
                            <option value="">Selecione o tipo do representante</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="REPRESENTATIVE">Representante</option>
                            <option value="MOTOBOY">Motoboy</option>
                        </select>
                        <br />
                        <div className='select-container'>
                            <label htmlFor="firm">Empresa: </label>
                            <Select
                                    id="firm"
                                    options={firms ? firms.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                    value={selectedFirm ? { value: selectedFirm.id, label: selectedFirm.name } : null}
                                    styles={customStyles}
                                    onChange={(selected) => {
                                        const firm = firms.find(pg => pg.id === selected?.value) || null; // Evita erro de undefined
                                        setSelectedFirm(firm);
                                        setUser(prevUser => ({ ...prevUser, firmId: firm ? firm.id : null })); // Garante que firmId nunca será undefined
                                    }}
                                    isSearchable
                                    placeholder="Selecione uma empresa"
                                />
                        </div>
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedUser && (
                    <article>
                        <h4>Excluir representante</h4>
                        <label htmlFor="name">Nome: </label>
                        <input 
                            type="text" 
                            placeholder="Ex: juntas de motor"
                            value={selectedUser.name} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar representantes de produtos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Nome: </label>
                            <Select
                                id="user"
                                options={users ? users.map(pg => ({ value: pg.id, label: pg.name })) : []}
                                value={selectedUser ? { value: selectedUser.id, label: selectedUser.name } : null}
                                styles={customStyles}
                                onChange={(selected) => setSelectedUser(users.find(pg => pg.id === selected.value))}
                                isSearchable
                                placeholder="Selecione um representante"
                            />
                        </div>

                        {/* Exibe informações do representante selecionado */}
                        {selectedUser && (
                            <section className="selected-user">
                                <h4>Detalhes do Representante Selecionada</h4>
                                <p><strong>Nome:</strong> {selectedUser.name}</p>
                                <p><strong>Sobrenome:</strong> {selectedUser.lastName}</p>
                                <p><strong>CPF:</strong> {selectedUser.document}</p>
                                <p><strong>E-mail:</strong> {selectedUser.email}</p>
                                <p><strong>Tipo:</strong> {selectedUser.userType}</p>
                                <p><strong>Empresa:</strong> {selectedUser.firm.name}</p>
                            </section>
                        )}
                        {isLoadingUsers && <p>Carregando...</p>}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default User;
