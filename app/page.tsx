import { ThockPlayground } from "@/components/thock-playground";
import { LaptopOnly } from "@/components/laptop-only";
import { ClientProvider } from "@/components/client-provider";

export default function Page() {
  return (
    <ClientProvider>
      <div className="block lg:hidden">
        <LaptopOnly />
      </div>
      <div className="hidden lg:block">
        <ThockPlayground />
      </div>
    </ClientProvider>
  );
}
