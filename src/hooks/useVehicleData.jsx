import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/vehicle`);
    return response.data;
}

export function useVehicleData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['vehicle-data'],
    })

    return query;
}