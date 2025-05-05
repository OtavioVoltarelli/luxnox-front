import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/product`);
    return response.data;
}

export function useProductData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['product-data'],
    })

    return query;
}