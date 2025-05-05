import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/engine`);
    return response.data;
}

export function useEngineData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['engine-data'],
    })

    return query;
}