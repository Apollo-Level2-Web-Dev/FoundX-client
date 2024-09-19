import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/Categories";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["GET_CATEGORIES"],
    queryFn: async () => await getCategories(),
  });
};
