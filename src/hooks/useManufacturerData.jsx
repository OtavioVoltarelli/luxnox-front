import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/manufacture`);
    return response.data;
}

export function useManufacturerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['manufacture-data'],
    })

    return query;
}