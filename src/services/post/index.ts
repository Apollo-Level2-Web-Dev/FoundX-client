"use server";

import { revalidateTag } from "next/cache";

import { getCurrentUser } from "../AuthService";

import envConfig from "@/src/config/envConfig";
import axiosInstance from "@/src/lib/AxiosInstance";

export const createPost = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidateTag("posts");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create post");
  }
};

export const getPost = async (postId: string) => {
  let fetchOptions = {};

  fetchOptions = {
    cache: "no-store",
  };

  const res = await fetch(`${envConfig.baseApi}/items/${postId}`, fetchOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getMyPosts = async () => {
  const user = await getCurrentUser();

  const res = await axiosInstance.get(`/items?user=${user?._id}`);

  return res.data;
};
