import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/manufacture`);
    return response.data;
}

export function useManufacturerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['manufacture-data'],
    })

    return query;
}