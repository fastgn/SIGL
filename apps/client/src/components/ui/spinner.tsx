import { cn } from "@/utilities/style";
import { LoaderCircle } from "lucide-react";
import { HTMLAttributes } from "react";

export const Spinner = ({ className, ...props }: HTMLAttributes<SVGSVGElement>) => {
  return <LoaderCircle className={cn("animate-spin w-20 h-20", className)} {...props} />;
};
