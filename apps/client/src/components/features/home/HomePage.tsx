import { Banner } from "@/components/common/banner/Banner.tsx";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner />
      </div>
      <div>
        <h1>Home</h1>
      </div>
    </div>
  );
};
