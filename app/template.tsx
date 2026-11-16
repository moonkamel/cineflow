import { PageTransition } from "@/components/motion";

// template.tsx re-mounts on every navigation → a soft fade between pages.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
