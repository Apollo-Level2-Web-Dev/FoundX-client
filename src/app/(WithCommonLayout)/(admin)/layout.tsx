import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1>Admin layout</h1>
      {children}
    </div>
  );
}
