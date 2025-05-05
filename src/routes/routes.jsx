import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Pages from "../pages/index";
import MainLayout from "./mainLayout";
import PrivateRoute from "./privateRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Pages.Login />} />

                <Route path="/" element={ 
                    <PrivateRoute>
                        <MainLayout> <Pages.Home /> </MainLayout> 
                    </PrivateRoute>
                } />

                <Route path="/clientes/empresas" element={ 
                    <PrivateRoute>
                        <MainLayout> <Pages.Firm /> </MainLayout> 
                    </PrivateRoute> 
                } />

                <Route path="/clientes/representantes" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.User/> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/produtos/grupos" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.ProductGroup /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/produtos/linhas" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.ProductLine /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/produtos/fabricantes" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.Manufacturer /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/produtos" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.Product /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/veiculos" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.Vehicle /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/veiculos/bases" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.BaseVehicle /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/veiculos/montadoras" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.Automaker /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/veiculos/motores" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.Engine /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/associacao/produtos-veiculos" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.ProductVehicle /> </MainLayout>
                    </PrivateRoute>
                } />

                <Route path="/associacao/produtos-similares" element={
                    <PrivateRoute>
                        <MainLayout> <Pages.SimilarProducts /> </MainLayout>
                    </PrivateRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
