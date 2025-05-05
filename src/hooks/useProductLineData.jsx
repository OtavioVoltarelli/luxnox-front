import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/product-line`);
    return response.data;
}

export function useProductLineData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['product-line-data'],
    })

    return query;
}