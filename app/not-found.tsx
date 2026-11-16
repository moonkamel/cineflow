import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70svh] flex-col items-center justify-center pt-16 text-center">
      <h1 className="text-5xl font-black">Lost your way?</h1>
      <p className="mt-3 text-muted-foreground">We couldn&apos;t find that page. There&apos;s plenty more to watch on the home page.</p>
      <Link href="/" className={buttonClass("default", "lg", "mt-6")}>
        Back to Home
      </Link>
    </div>
  );
}
