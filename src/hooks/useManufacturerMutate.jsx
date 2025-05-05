import api from "../axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return api.post(`/manufacture`, data);
}

export function useManufacturerMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['manufacture-data']);

        }
    })
    return mutate;
}

