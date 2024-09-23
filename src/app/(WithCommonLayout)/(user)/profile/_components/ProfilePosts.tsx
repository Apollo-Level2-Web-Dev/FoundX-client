"use client";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { IReceivedClaimRequest } from "@/src/types";
import ImageGallery from "@/src/components/UI/Post/ImageGallery";

type TProps = {
  post: IReceivedClaimRequest;
};

export default function ProfilePosts({ post }: TProps) {
  const {
    claimRequests,
    title,
    dateFound,
    description,
    location,
    city,
    _id,
    images,
  } = post || {};

  return (
    <div className="mb-2 rounded-md bg-default-100 p-4">
      <div className="border-b border-default-200 pb-2">
        <div className="border-b border-default-200 py-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <Link href={`/found-items/${_id}`}>
                <h1 className="cursor-pointer text-2xl">{title}</h1>
              </Link>
              <p className="flex items-center gap-1 text-xs">
                Found on: <Calendar width={14} />
                {format(new Date(dateFound), "dd MMM, yyyy")}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1">
                <MapPin width={18} />
                {location}, {city}
              </p>
            </div>
          </div>
          <p>{description}</p>
        </div>

        <ImageGallery images={images} />
      </div>
    </div>
  );
}
