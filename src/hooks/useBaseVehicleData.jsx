import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CONFIG from "../config";


const fetchData = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/base-vehicle`);
    return response.data;
}

export function useBaseVehicleData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['base-vehicle-data'],
    })

    return query;
}