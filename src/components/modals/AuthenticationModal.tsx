"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";

import FXModal from "./FXModal";

interface IProps {
  id: string;
}

const AuthenticationModal = ({ id }: IProps) => {
  return (
    <FXModal
      buttonClassName="flex-1"
      buttonText="Claim Item"
      title="Authentication"
    >
      <div>
        You are not currently logged in. Please login first to continue.
      </div>
      <div className="mb-4 mt-2 flex gap-2">
        <Link className="flex-1" href={`/register?redirect=found-items/${id}`}>
          <Button className="w-full">Register</Button>
        </Link>
        <Link className="flex-1" href={`/login?redirect=found-items/${id}`}>
          <Button className="w-full">Login</Button>
        </Link>
      </div>
    </FXModal>
  );
};

export default AuthenticationModal;
