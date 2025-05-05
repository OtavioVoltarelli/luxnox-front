import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/firm`);
    return response.data;
}

export function useFirmData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['firm-data'],
    })

    return query;
}