import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/vehicle`);
    return response.data;
}

export function useVehicleData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['vehicle-data'],
    })

    return query;
}