import React from "react";
import { Banner } from "@/components/common/banner/Banner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BasicPageProps {
  title: string;
  extraComponent?: React.ReactNode;
  children: React.ReactNode;
}

export const BasicPage: React.FC<BasicPageProps> = ({ title, extraComponent, children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Banner />
      <ScrollArea className="w-full overflow-x-auto">
        <div className="flex flex-col gap-5 px-4 pt-3 pb-12 sm:px-8 sm:pt-6 md:px-12 md:pt-9 lg:px-16 lg:pt-12">
          <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between ">
            <h1 className="text-3xl font-bold">{title}</h1>
            {extraComponent ?? null}
          </div>
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};
