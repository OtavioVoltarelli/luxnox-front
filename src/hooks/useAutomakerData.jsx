import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/automaker`);
    return response.data;
}

export function useAutomakerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['automaker-data'],
    })

    return query;
}