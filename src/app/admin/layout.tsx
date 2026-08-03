import { Suspense, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { FlashToast } from "@/components/ui/flash-toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <FlashToast />
      </Suspense>
      {children}
    </ToastProvider>
  );
}
