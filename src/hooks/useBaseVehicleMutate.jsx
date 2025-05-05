import api from "../axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const postData = async (data) => {
    return api.post(`/base-vehicle`, data);
}

export function useBaseVehicleMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['base-vehicle-data']);

        }
    })
    return mutate;
}

