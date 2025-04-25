import './transferList.css'
import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ReactSelect from "react-select";
import { useProductData } from '../../hooks/useProductData';
import axios from 'axios';
import CONFIG from '../../config';
import Modal from '../Modal/modal';

function not(a, b) {
    return a.filter((aItem) => !b.some((bItem) => bItem.id === aItem.id));
}

function intersection(a, b) {
    return a.filter((aItem) => b.some((bItem) => bItem.id === aItem.id));
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function TransferListSimilarProducts() {
    const [checked, setChecked] = React.useState([]);
    const [nonSimilarProducts, setNonSimilarProducts] = React.useState([]);
    const [similarProducts, setSimilarProducts] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState(null)
    const [isLoadingSimilars, setIsLoadingSimilars] = React.useState(true)

    const { data: products, isLoading: isLoadingProducts } = useProductData();

    const [modalMessage, setModalMessage] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)

    const nonSimilarProductsChecked = intersection(checked, nonSimilarProducts);
    const similarProductsChecked = intersection(checked, similarProducts);

    const [filterSimilars, setFilterSimilars] = React.useState("");
    const [filterNonSimilars, setFilterNonSimilars] = React.useState("");

    React.useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!selectedProduct) return;


            const remainingProducts = products.filter((p => p.id !== selectedProduct.value))

            try {
                const response = await axios.get(`${CONFIG.API_URL}/product/${selectedProduct.value}/similar-products`)
                setSimilarProducts(response.data)
                const nonSimilars = await not(remainingProducts, response.data)
                setNonSimilarProducts(nonSimilars)
            } catch (error) {
                console.error("Erro ao buscar prdutos similares:", error)
            } finally {
                setIsLoadingSimilars(false)
            }
        };

        fetchSimilarProducts();
    }, [selectedProduct])

    const save = async () => {
        const idsList = similarProducts.map(v => v.id);

        try {
            await axios.put(`${CONFIG.API_URL}/product/${selectedProduct.value}/similar-products`, {
                similarProductsIds: idsList
            })
            setModalMessage("Alterações salvas com sucesso!")
        } catch (error) {
            console.error("Erro ao salvar alterações:", error)
            setModalMessage("Erro ao salvar alterações!")
        } finally {
            setModalVisible(true)
            setSelectedProduct(null)
            setIsLoadingSimilars(true)
            setSimilarProducts([])
            setNonSimilarProducts([])
        }
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.findIndex((item) => item.id === value.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedSimilarProducts = () => {
        setSimilarProducts(similarProducts.concat(nonSimilarProductsChecked));
        setNonSimilarProducts(not(nonSimilarProducts, nonSimilarProductsChecked));
        setChecked(not(checked, nonSimilarProductsChecked));
    };

    const handleCheckedNonSimilarProducts = () => {
        setNonSimilarProducts(nonSimilarProducts.concat(similarProductsChecked));
        setSimilarProducts(not(similarProducts, similarProductsChecked));
        setChecked(not(checked, similarProductsChecked));
    };

    const filteredSimilars = similarProducts.filter((p) => `${p.code} - ${p.name} - ${p.manufacture.name}`.toLowerCase().includes(filterSimilars.toLowerCase()))

    const filteredNonSimilars = nonSimilarProducts.filter((p) => `${p.code} - ${p.name} - ${p.manufacture.name}`.toLowerCase().includes(filterNonSimilars.toLowerCase()))

    const customList = (title, items, filterValue, setFilterValue) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={
                    <>
                        {title} <br />
                        <input
                            type='text'
                            placeholder='Filtrar por...'
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            style={{ width: '90%', marginTop: '5px', padding: '4px' }}
                        />
                    </>
                }
                subheader={`${numberOfChecked(items)}/${items.length} selecionados`}
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    height: '320px',
                    bgcolor: '#f0f0f0',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={value.id}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.includes(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`
                    ${value.code} -
                    ${value.name} -
                    ${value.manufacture.name} `} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: "70%",
            margin: "5px auto",
            height: "30px",
            backgroundColor: "#f0f0f0",
            borderColor: "grey", // cor da borda
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#888", // cor ao passar o mouse
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "lightgrey" : "fff", // cor da opção selecionada
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

    if (isLoadingProducts) {
        return <p className='loading'>Carregando dados...</p>;
    }

    return (
        <main className='transferlist-container'>
            <h2>ASSOCIAÇÃO PRODUTOS SIMILARES</h2>
            <div className='fields-section'>
                <section className='select-entity'>
                    <ReactSelect
                        options={products.map((p) => ({
                            value: p.id,
                            label: `${p.code} - ${p.name} - ${p.manufacture.name}`
                        }))}
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        placeholder="selecione um produto"
                        styles={customStyles}
                    />
                </section>
                {selectedProduct && !isLoadingSimilars &&
                    <section className='transfer-list'>
                        <Grid
                            container
                            spacing={2}
                            sx={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Grid sx={{ width: '40%' }} >{customList('Não Similares', filteredNonSimilars, filterNonSimilars, setFilterNonSimilars)}</Grid>
                            <Grid>
                                <Grid container direction="column" sx={{ alignItems: 'center' }}>
                                    <Button
                                        sx={{ my: 0.5, color: '#CB1E00', backgroundColor: 'white', border: '1px solid #CB1E00' }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedSimilarProducts}
                                        disabled={
                                            checked.filter((c) => filteredNonSimilars.some((v) => v.id === c.id)).length === 0
                                        }
                                        aria-label="move selected similarProducts"
                                    >
                                        &gt;
                                    </Button>
                                    <Button
                                        sx={{ my: 0.5, color: '#CB1E00', backgroundColor: 'white', border: '1px solid #CB1E00' }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedNonSimilarProducts}
                                        disabled={
                                            checked.filter((c) => filteredSimilars.some((v) => v.id === c.id)).length === 0
                                        }
                                        aria-label="move selected nonSimilarProducts"
                                    >
                                        &lt;
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid sx={{ width: '40%' }}>{customList('Similares', filteredSimilars, filterSimilars, setFilterSimilars)}</Grid>
                        </Grid>
                        <div className='save-button'>
                            <button onClick={save}>Salvar alterações</button>
                        </div>
                    </section>
                }
            </div>
            <Modal message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </main>
    );
}