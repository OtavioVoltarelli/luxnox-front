import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/base-vehicle`);
    return response.data;
}

export function useBaseVehicleData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['base-vehicle-data'],
    })

    return query;
}