import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/user`);
    return response.data;
}

export function useUserData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['user-data'],
    })

    return query;
}