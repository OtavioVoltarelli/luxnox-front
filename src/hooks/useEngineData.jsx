import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/engine`);
    return response.data;
}

export function useEngineData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['engine-data'],
    })

    return query;
}