import api from "../axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return api.post(`/automaker`, data);
}

export function useAutomakerMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['automaker-data']);

        }
    })
    return mutate;
}

