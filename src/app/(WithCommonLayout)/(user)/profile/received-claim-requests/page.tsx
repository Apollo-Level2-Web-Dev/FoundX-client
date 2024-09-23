"use client";

import ClaimPostCard from "@/src/components/UI/Post/ClaimPostCard";
import { useGetReceivedClaimRequest } from "@/src/hooks/claimRequest.hook";
import { IReceivedClaimRequest } from "@/src/types";

const ReceivedClaimRequestsPage = () => {
  const { data } = useGetReceivedClaimRequest();

  const posts = data?.data || [];

  return (
    <>
      {posts?.length ? (
        posts.map((post: IReceivedClaimRequest, index: number) => (
          <ClaimPostCard key={index} post={post} />
        ))
      ) : (
        <div className="flex min-h-screen w-full items-center justify-center rounded-md bg-default-100">
          <h1 className="text-4xl">No Claim Request Received!</h1>
        </div>
      )}
    </>
  );
};

export default ReceivedClaimRequestsPage;
