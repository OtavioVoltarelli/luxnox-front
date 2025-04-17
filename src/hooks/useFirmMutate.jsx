import axios from "axios";
import CONFIG from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return axios.post(`${CONFIG.API_URL}/firm`, data);
}

export function useFirmMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['firm-data']);

        }
    })
    return mutate;
}

