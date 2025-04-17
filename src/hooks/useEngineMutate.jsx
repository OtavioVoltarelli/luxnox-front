import axios from "axios";
import CONFIG from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return axios.post(`${CONFIG.API_URL}/engine`, data);
}

export function useEngineMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['engine-data']);

        }
    })
    return mutate;
}

