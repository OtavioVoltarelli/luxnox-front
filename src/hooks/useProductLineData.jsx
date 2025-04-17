import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/product-line`);
    return response.data;
}

export function useProductLineData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['product-line-data'],
    })

    return query;
}