import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Bloc {
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
  isOpenable?: boolean;
  defaultOpen?: boolean;
}

export const Bloc: React.FC<Bloc> = ({
  title,
  children,
  actions,
  isOpenable = false,
  defaultOpen,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenable ? defaultOpen || false : true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="w-full h-fit shadow-0 border-0">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-xl">
          <div className="flex items-center gap-2">
            {isOpenable && (
              <Button variant="empty" onClick={toggleAccordion} className="p-2">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            )}
            <span
              className={isOpenable ? "cursor-pointer" : ""}
              onClick={isOpenable ? toggleAccordion : undefined}
            >
              {title}
            </span>
          </div>
          <div className="flex items-center">{actions}</div>
        </CardTitle>
      </CardHeader>
      {isOpen && <CardContent className="space-y-6">{children}</CardContent>}
    </Card>
  );
};

export default Bloc;
