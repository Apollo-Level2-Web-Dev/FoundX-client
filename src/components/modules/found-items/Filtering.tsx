"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import { RotateCw } from "lucide-react";

import { ICategory } from "@/src/types";
import { useGetCategories } from "@/src/hooks/categoreis.hook";

const Filtering = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useGetCategories();
  const { data: categories } = data || [];

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const [key, value] = category.split("=");

    params.set(key, value);

    router.push(`/found-items?${params.toString()}`);
  };

  return (
    <div className="my-5 flex items-center justify-end">
      <div className="flex justify-center gap-1">
        {categories?.map(({ _id, name }: ICategory) => (
          <Button
            key={_id}
            size="sm"
            variant="ghost"
            onClick={() => handleCategoryChange(`category=${name}`)}
          >
            {name}
          </Button>
        ))}
        <Button className="rounded-lg" size="sm" variant="ghost">
          <RotateCw onClick={() => router.push("/found-items")} />
        </Button>
      </div>
    </div>
  );
};

export default Filtering;
