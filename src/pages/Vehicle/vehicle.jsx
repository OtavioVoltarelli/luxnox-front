import './vehicle.css'
import api from '../../axiosConfig';
import { useState, useEffect } from "react";
import Select from 'react-select'
import Modal from "../../components/Modal/modal";
import { useVehicleData } from '../../hooks/useVehicleData';
import { useVehicleMutate } from '../../hooks/useVehicleMutate';
import { useBaseVehicleData } from '../../hooks/useBaseVehicleData';
import { useEngineData } from '../../hooks/useEngineData';


const Vehicle = () => {
    const [modo, setModo] = useState("register");
    const [vehicle, setVehicle] = useState({
        model: "",
        yearStart: "",
        yearEnd: "",
        valve: ""
    });
    const [modalMessage, setModalMessage] = useState(""); // mensagem modal
    const [modalVisible, setModalVisible] = useState(false); // controle visibilidade modal
    const [selectedVehicle, setSelectedVehicle] = useState(null); // Inicializado como null
    const [selectedBaseVehicle, setSelectedBaseVehicle] = useState(null);
    const [selectedEngine, setSelectedEngine] = useState(null);

    const [vehiclesByBase, setVehiclesByBase] = useState([]);

    const { data: baseVehicles, isLoading: isLoadingBaseVehicles } = useBaseVehicleData();
    const { data: engines, isLoading: isLoadingEngines } = useEngineData();
    const { data: vehicles, isLoading: isLoadingVehicles } = useVehicleData();
    const { mutate, isSuccess, isError } = useVehicleMutate();


    const handleChange = (e) => {
        const { name, value } = e.target; // pega o nome e o valor do campo que foi alterado
        setVehicle((prevVehicle) => ({
            ...prevVehicle, // mantem os valores anteriores
            [name]: value, // atualiza apenas o campo específico que foi alterado
        }));
    };
    
    
    useEffect(() => {
        if (selectedVehicle) {
            setVehicle(selectedVehicle);
        }
    }, [selectedVehicle]);
    
    
    useEffect(() => {
        if (selectedBaseVehicle) {
            findVehicleByBaseVehicleId();
        }
    }, [selectedBaseVehicle]);


    const findVehicleByBaseVehicleId = async () => {
        try {
            const vehiclesByBaseVehiclesId = await api.get(`/vehicle/base/${selectedBaseVehicle.id}`)
            setVehiclesByBase(vehiclesByBaseVehiclesId.data)
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao encontrar veículos.");
        }

    }


    const register = async () => {
        // if (Object.values(vehicle).some(value => !value.trim())) 
        //     return setModalMessage("Preencha todos os campos!"), setModalVisible(true);

        const data = {
            model: vehicle.model,
            baseVehicleId: selectedBaseVehicle.id,
            yearStart: vehicle.yearStart,
            yearEnd: vehicle.yearEnd,
            engineId: selectedEngine.id,
            valve: vehicle.valve
        }

        mutate(data)
    };

    //mensagem de sucesso ao cadastar
    useEffect(() => {
        if (isSuccess) {
            setModalMessage("Veículo cadastrado com sucesso!");
            setModalVisible(true);
            setVehicle("");
        }
    }, [isSuccess]);

    //mensagem de erro
    useEffect(() => {
        if (isError) {
            setModalMessage("Erro ao cadastrar veículo! Esse nome já pode existir.");
            setModalVisible(true);
        }
    }, [isError]);


    const edit = async () => {
        // if (Object.values(vehicle).some(value => !value.trim())) 
        //     return setModalMessage("Preencha todos os campos!");

        const data = {
            model: vehicle.model,
            baseVehicleId: selectedBaseVehicle.id,
            yearStart: vehicle.yearStart,
            yearEnd: vehicle.yearEnd,
            engineId: selectedEngine.id,
            valve: vehicle.valve
        }

        try {
            const response = await api.put(`/vehicle/${selectedVehicle.id}`, data);

            setModalMessage("Veículo editado com sucesso!");
            setVehicle(""); // limpa o campo
            setModalVisible(true);
            setSelectedVehicle(null); // limpa a veículo selecionada
            setSelectedBaseVehicle(null);
            setSelectedEngine(null);
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao editar veículo.");
        }
    };

    const del = async () => {
        try {
            const response = await api.delete(`/vehicle/${selectedVehicle.id}`, {});

            setModalMessage("Veículo excluído com sucesso!");
            setModalVisible(true);
            setSelectedVehicle(null); // limpa a seleção
        } catch (error) {
            console.error("Erro:", error);
            alert(error.response?.data || "Erro ao excluir veículo.");
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

    if (isLoadingBaseVehicles || isLoadingEngines || isLoadingVehicles) {
        return <p>Carregando dados...</p>}

    return (
        <main className="vehicle-container">
            <h2>Veículos</h2>

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
                        <h4>Cadastrar veículo</h4>
                        <label htmlFor="model">Modelo: </label>
                        <input
                            id='model'
                            name='model'
                            type="text"
                            placeholder="ex: way (opcional)"
                            value={vehicle.model}
                            onChange={handleChange}
                        />
                        <div className='select-container'>
                            <label htmlFor="baseVehicle">Base de veículo: </label>
                            <Select 
                            id='baseVehicle'
                            options={baseVehicles ? baseVehicles.map(a => ({
                                value: a.id, label: `${a.automaker.name} ${a.name}`})) : []}
                            value={selectedBaseVehicle ? {value: selectedBaseVehicle.id, label: `${selectedBaseVehicle.automaker.name} ${selectedBaseVehicle.name}`} : null}
                            styles={customStyles}
                            onChange={(selected) => setSelectedBaseVehicle(baseVehicles.find(a => a.id === selected.value))}
                            isSearchable
                            placeholder="Selecione uma base de veículo"
                            />

                            <label htmlFor="engine">Motor: </label>
                            <Select 
                            id='baseVehicle'
                            options={engines ? engines.map(a => ({
                                value: a.id, label: a.name})) : []}
                            value={selectedEngine ? {value: selectedEngine.id, label: selectedEngine.name} : null}
                            styles={customStyles}
                            onChange={(selected) => setSelectedEngine(engines.find(a => a.id === selected.value))}
                            isSearchable
                            placeholder="Selecione um motor"
                            />
                        </div>
                        <label htmlFor="yearStart">Ano inicial: </label>
                        <input
                            id='yearStart'
                            name='yearStart'
                            type="text"
                            placeholder="Ex: 2010"
                            value={vehicle.yearStart}
                            onChange={handleChange}
                            maxLength='4'
                        />
                        <label htmlFor="yearEnd">Ano final: </label>
                        <input
                            id='yearEnd'
                            name='yearEnd'
                            type="text"
                            placeholder="Ex: 2013"
                            value={vehicle.yearEnd}
                            onChange={handleChange}
                            maxLength='4'
                        /> <br />
                        <label htmlFor="valve">Válvula: </label>
                        <input
                            id='valve'
                            name='valve'
                            type="text"
                            placeholder='ex: 16'
                            value={vehicle.valve}
                            onChange={handleChange}
                            maxLength="2"
                        />
                        <br/>
                        <button onClick={register}>Cadastrar</button>
                    </article>
                )}

                {modo === "edit" && selectedVehicle && (
                    <article>
                        <h4>Editar veículo</h4>
                        <label htmlFor="model">Modelo: </label>
                        <input
                            id='model'
                            name='model'
                            type="text"
                            placeholder="Ex: uno mile"
                            value={vehicle.model}
                            onChange={handleChange}
                        />
                        <div className='select-container'>
                            <label htmlFor="baseVehicle">Base de veículo: </label>
                            <Select 
                            id='baseVehicle'
                            options={baseVehicles ? baseVehicles.map(a => ({
                                value: a.id, label: `${a.automaker.name} ${a.name}`})) : []}
                            value={selectedBaseVehicle ? {value: selectedBaseVehicle.id, label: `${selectedBaseVehicle.automaker.name} ${selectedBaseVehicle.name}`} : null}
                            styles={customStyles}
                            onChange={(selected) => setSelectedBaseVehicle(baseVehicles.find(a => a.id === selected.value))}
                            isSearchable
                            placeholder="Selecione uma base de veículo"
                            />
                            <label htmlFor="engine">Motor: </label>
                            <Select 
                            id='baseVehicle'
                            options={engines ? engines.map(a => ({
                                value: a.id, label: a.name})) : []}
                            value={selectedEngine ? {value: selectedEngine.id, label: selectedEngine.name} : null}
                            styles={customStyles}
                            onChange={(selected) => setSelectedEngine(engines.find(a => a.id === selected.value))}
                            isSearchable
                            placeholder="Selecione um motor"
                            />
                        </div>
                        <label htmlFor="yearStart">Ano inicial: </label>
                        <input
                            id='yearStart'
                            name='yearStart'
                            type="text"
                            placeholder="Ex: 2010"
                            value={vehicle.yearStart}
                            onChange={handleChange}
                        />
                        <label htmlFor="yearEnd">Ano final: </label>
                        <input
                            id='yearEnd'
                            name='yearEnd'
                            type="text"
                            placeholder="Ex: 2013"
                            value={vehicle.yearEnd}
                            onChange={handleChange}
                        /> <br />
                        <label htmlFor="valve">Válvula: </label>
                        <input
                            id='valve'
                            name='valve'
                            type="text"
                            placeholder='ex: 16'
                            value={vehicle.valve}
                            onChange={handleChange}
                            maxLength="2"
                        />
                        <br />
                        <button onClick={edit}>Salvar Alterações</button>
                    </article>
                )}

                {modo === "delete" && selectedVehicle && (
                    <article>
                        <h4>Excluir veículo</h4>
                        <label htmlFor="model">Modelo: </label>
                        <input
                            id='model'
                            type="text" 
                            placeholder="Ex: motor"
                            value={selectedVehicle.model} readOnly /> <br />
                        <button className="delete-button" onClick={del}>Excluir</button>
                    </article>
                )}

                {/* Campo de pesquisa */}
                {modo === "search" && (
                    <article>
                        <h4>Pesquisar veículos</h4>
                        <div className='select-container'>
                            <label htmlFor="name-search">Base do veículo: </label>
                            <Select
                                id="vehicle"
                                options={baseVehicles ? baseVehicles.map(pg => ({ value: pg.id, label: `${pg.automaker.name} ${pg.name}` })) : []}
                                value={selectedBaseVehicle ? { value: selectedBaseVehicle.id, label: `${selectedBaseVehicle.automaker.name} ${selectedBaseVehicle.name}` } : null}
                                styles={customStyles}
                                isSearchable
                                placeholder="Selecione uma base de veículo"
                                onChange={(selected) => {
                                    const baseVehicle = baseVehicles.find(pg => pg.id === selected.value);
                                    setSelectedBaseVehicle(baseVehicle)
                                }}
                            />
                        </div>
                        <div className='select-container'>
                            <label htmlFor="name-search">Veículo completo: </label>
                            <Select
                                id="vehicle"
                                options={vehiclesByBase ? vehiclesByBase.map(pg => ({ value: pg.id, label: `${pg.model} ${pg.engine.name} ${pg.valve} valvulas ${pg.yearStart} a ${pg.yearEnd}` })) : []}
                                value={selectedVehicle ? { value: selectedVehicle.id, label: `${selectedVehicle.model} ${selectedVehicle.engine.name} ${selectedVehicle.valve} valvulas ${selectedVehicle.yearStart} a ${selectedVehicle.yearEnd}` } : null}
                                styles={customStyles}
                                isSearchable
                                placeholder="Selecione um veículo"
                                onChange={(selected) => {
                                    const vehicle = vehiclesByBase.find(pg => pg.id === selected.value);
                                    setSelectedVehicle(vehicle)
                                }}
                            />
                        </div>

                        {/* Exibe informações da veículo selecionada */}
                        {selectedVehicle && (
                            <section className="selected-vehicle">
                                <h4>Detalhes do Veículo Selecionado</h4>
                                <p><strong>Montadora:</strong> {selectedVehicle.baseVehicle.automaker.name}</p>
                                <p><strong>Veículo:</strong> {selectedVehicle.baseVehicle.name}</p>
                                <p><strong>Modelo:</strong> {selectedVehicle.model}</p>
                                <p><strong>Ano Inicial:</strong> {selectedVehicle.yearStart}</p>
                                <p><strong>Ano Final:</strong> {selectedVehicle.yearEnd}</p>
                                <p><strong>Motor:</strong> {selectedVehicle.engine.name}</p>
                                <p><strong>Válvula:</strong> {selectedVehicle.valve}</p>
                            </section>
                        )}
                    </article>
                )}
            </section>
            {/* Modal */}
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
};

export default Vehicle;
