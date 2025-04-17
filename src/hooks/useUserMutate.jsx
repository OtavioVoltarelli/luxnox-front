import axios from "axios";
import CONFIG from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return axios.post(`${CONFIG.API_URL}/user`, data);
}

export function useUserMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['user-data']);

        }
    })
    return mutate;
}

