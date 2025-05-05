import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/product-group`);
    return response.data;
}

export function useProductGroupData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['product-group-data'],
    })

    return query;
}