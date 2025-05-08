import { Link } from "wouter";
import { ReceiptIcon } from "lucide-react";

export function Navbar() {
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-center border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <ReceiptIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">
              Receipt Scanner
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}