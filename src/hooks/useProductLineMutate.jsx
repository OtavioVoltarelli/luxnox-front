import api from "../axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return api.post(`/product-line`, data);
}

export function useProductLineMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['product-line-data']);

        }
    })
    return mutate;
}

