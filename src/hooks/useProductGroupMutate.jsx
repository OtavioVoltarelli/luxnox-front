import axios from "axios";
import CONFIG from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return axios.post(`${CONFIG.API_URL}/product-group`, data);
}

export function useProductGroupMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['product-group-data']);

        }
    })
    return mutate;
}

