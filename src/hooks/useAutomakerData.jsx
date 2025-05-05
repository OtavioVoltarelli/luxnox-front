import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/automaker`);
    return response.data;
}

export function useAutomakerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['automaker-data'],
    })

    return query;
}