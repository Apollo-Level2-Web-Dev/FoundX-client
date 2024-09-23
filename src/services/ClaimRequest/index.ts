"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";

export const addClaimRequest = async (
  claimRequest: FieldValues
): Promise<any> => {
  try {
    const res = await axiosInstance.post("/claim-request", claimRequest);

    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getReceivedClaimRequest = async () => {
  try {
    const res = await axiosInstance.get(
      "/claim-request/received-claim-request"
    );

    return res.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to fetch data");
  }
};
