import { Banner } from "@/components/common/banner/Banner.tsx";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { AddUserSheet } from "../users/add-user-sheet";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner isAdmin={true} />
      </div>
      <div>
        <h1>Home</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Create User</Button>
          </SheetTrigger>
          <AddUserSheet />
        </Sheet>
      </div>
    </div>
  );
};
