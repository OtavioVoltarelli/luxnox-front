import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/product-group`);
    return response.data;
}

export function useProductGroupData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['product-group-data'],
    })

    return query;
}