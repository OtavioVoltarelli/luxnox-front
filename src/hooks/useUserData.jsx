import { useQuery } from "@tanstack/react-query";
import api from "../axiosConfig";


const fetchData = async () => {
    const response = await api.get(`/user`);
    return response.data;
}

export function useUserData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['user-data'],
    })

    return query;
}