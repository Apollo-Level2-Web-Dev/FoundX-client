import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { addClaimRequest } from "../services/ClaimRequest";
import { toast } from "sonner";

export const useAddClaimRequest = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["ADD_CLAIM_REQUEST"],
    mutationFn: async (postData) => await addClaimRequest(postData),
    onSuccess: () => {
      toast.success("Claim Request Created Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
