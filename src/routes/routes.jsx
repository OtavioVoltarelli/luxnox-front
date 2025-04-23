import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Pages from "../pages/index";
import MainLayout from "./mainLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Pages.Login />} />

                <Route path="/" element={ <MainLayout> <Pages.Home /> </MainLayout> } />
                <Route path="/clientes/empresas" element={ <MainLayout> <Pages.Firm /> </MainLayout> } />
                <Route path="/clientes/representantes" element={ <MainLayout> <Pages.User/> </MainLayout> } />
                <Route path="/produtos/grupos" element={ <MainLayout> <Pages.ProductGroup /> </MainLayout> } />
                <Route path="/produtos/linhas" element={ <MainLayout> <Pages.ProductLine /> </MainLayout> } />
                <Route path="/produtos/fabricantes" element={ <MainLayout> <Pages.Manufacturer /> </MainLayout> } />
                <Route path="/produtos" element={ <MainLayout> <Pages.Product /> </MainLayout> } />
                <Route path="/veiculos" element={ <MainLayout> <Pages.Vehicle /> </MainLayout> } />
                <Route path="/veiculos/bases" element={ <MainLayout> <Pages.BaseVehicle /> </MainLayout> } />
                <Route path="/veiculos/montadoras" element={ <MainLayout> <Pages.Automaker /> </MainLayout> } />
                <Route path="/veiculos/motores" element={ <MainLayout> <Pages.Engine /> </MainLayout> } />
                <Route path="/associacao/produtos-veiculos" element={ <MainLayout> <Pages.ProductVehicle /> </MainLayout> } />
                <Route path="/associacao/produtos-similares" element={ <MainLayout> <Pages.SimilarProducts /> </MainLayout> } />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
