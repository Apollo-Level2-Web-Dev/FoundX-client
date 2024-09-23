"use client";

import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { allDistict } from "@bangladeshi/bangladesh-address";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FXInput from "@/src/components/form/FXInput";
import FXDatePicker from "@/src/components/form/FXDatePicker";
import dateToISO from "@/src/utils/dateToISO";
import FXSelect from "@/src/components/form/FXSelect";
import { useGetCategories } from "@/src/hooks/categoreis.hook";
import FXTextarea from "@/src/components/form/FXTextArea";
import { AddIcon, TrashIcon } from "@/src/assets/icons";
import { useUser } from "@/src/context/user.provider";
import { useCreatePost } from "@/src/hooks/post.hook";
import Loading from "@/src/components/UI/Loading";
import generateDescription from "@/src/services/ImageDescription";

const cityOptions = allDistict()
  .sort()
  .map((city: string) => {
    return {
      key: city,
      label: city,
    };
  });

export default function CreatePost() {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    mutate: handleCreatePost,
    isPending: createPostPending,
    isSuccess,
  } = useCreatePost();

  const { user } = useUser();

  const {
    data: categoriesData,
    isLoading: categoryLoading,
    isSuccess: categorySuccess,
  } = useGetCategories();

  let categoryOption: { key: string; label: string }[] = [];

  if (categoriesData?.data && !categoryLoading) {
    categoryOption = categoriesData.data
      .sort()
      .map((category: { _id: string; name: string }) => ({
        key: category._id,
        label: category.name,
      }));
  }

  const methods = useForm();

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = new FormData();

    const postData = {
      ...data,
      questions: data.questions.map((que: { value: string }) => que.value),
      dateFound: dateToISO(data.dateFound),
      user: user!._id,
    };

    formData.append("data", JSON.stringify(postData));

    for (let image of imageFiles) {
      formData.append("itemImages", image);
    }

    handleCreatePost(formData);
  };

  const handleFieldAppend = () => {
    append({ name: "questions" });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    setImageFiles((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await generateDescription(
        imagePreviews[0],
        "write a description for social media post describing the given image that starts with 'Found this...'"
      );

      methods.setValue("description", response);
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (!createPostPending && isSuccess) {
    router.push("/");
  }

  return (
    <>
      {createPostPending && <Loading />}
      <div className="h-full rounded-xl bg-gradient-to-b from-default-100 px-[73px] py-12">
        <h1 className="text-2xl font-semibold">Post a found item</h1>
        <Divider className="mb-5 mt-3" />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-2 py-2">
              <div className="min-w-fit flex-1">
                <FXInput label="Title" name="title" />
              </div>
              <div className="min-w-fit flex-1">
                <FXDatePicker label="Found date" name="dateFound" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 py-2">
              <div className="min-w-fit flex-1">
                <FXInput label="Location" name="location" />
              </div>
              <div className="min-w-fit flex-1">
                <FXSelect label="City" name="city" options={cityOptions} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 py-2">
              <div className="min-w-fit flex-1">
                <FXSelect
                  disabled={!categorySuccess}
                  label="Category"
                  name="category"
                  options={categoryOption}
                />
              </div>
              <div className="min-w-fit flex-1">
                <label
                  className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
                  htmlFor="image"
                >
                  Upload image
                </label>
                <input
                  multiple
                  className="hidden"
                  id="image"
                  type="file"
                  onChange={(e) => handleImageChange(e)}
                />
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex gap-5 my-5 flex-wrap">
                {imagePreviews.map((imageDataUrl) => (
                  <div
                    key={imageDataUrl}
                    className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2"
                  >
                    <img
                      alt="item"
                      className="h-full w-full object-cover object-center rounded-md"
                      src={imageDataUrl}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap-reverse gap-2 py-2">
              <div className="min-w-fit flex-1">
                <FXTextarea label="Description" name="description" />
              </div>
            </div>

            <div className="flex justify-end gap-5">
              {methods.getValues("description") && (
                <Button onClick={() => methods.resetField("description")}>
                  Clear
                </Button>
              )}
              <Button
                isDisabled={imagePreviews.length > 0 ? false : true}
                isLoading={isLoading}
                onClick={() => handleDescriptionGeneration()}
              >
                {isLoading ? "Generating...." : "Generate with AI"}
              </Button>
            </div>

            <Divider className="my-5" />

            <div className="flex justify-between items-center mb-5">
              <h1 className="text-xl">Owner verification questions</h1>
              <Button isIconOnly onClick={() => handleFieldAppend()}>
                <AddIcon />
              </Button>
            </div>

            <div className="space-y-5">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <FXInput label="Question" name={`questions.${index}.value`} />
                  <Button
                    isIconOnly
                    className="h-14 w-16"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            </div>

            <Divider className="my-5" />
            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Post
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
