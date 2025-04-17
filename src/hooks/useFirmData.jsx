import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/firm`);
    return response.data;
}

export function useFirmData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['firm-data'],
    })

    return query;
}