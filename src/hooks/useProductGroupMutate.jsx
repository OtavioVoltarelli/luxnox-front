import api from "../axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return api.post(`/product-group`, data);
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

