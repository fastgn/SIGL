import { Banner } from "@/components/common/banner/Banner.tsx";
import DemoForm from "@/components/features/demo/demo-form.tsx";

export const DemoPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Banner />
      </div>
      <div>
        <DemoForm />
      </div>
    </div>
  );
};
