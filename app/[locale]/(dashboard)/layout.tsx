"use client";

import Progress from "@/features/home/components/add-project/Progress";
import {
  AddProjectProvider,
  useAddProject,
} from "@/features/home/components/add-project/add-project-provider";
import Step1 from "@/features/home/components/add-project/Step1";
import Step2 from "@/features/home/components/add-project/Step2";
import Step3 from "@/features/home/components/add-project/Step3";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { step, nextStep, exitAddProject, finishAddProject } = useAddProject();

  if (step !== null) {
    return (
      <div className="flex flex-1 bg-neutral-75 px-6 py-8 lg:px-10">
        <div className="flex-1 animate-fade-in-up">
          <div className="flex flex-1 flex-col items-center gap-12 py-6">
            <Progress currentStep={step} />

            <div className="relative flex min-h-[350px] w-full justify-center">
              <div
                key={step}
                className="flex w-full animate-fade-in-left justify-center"
              >
                {step === 1 && <Step1 onNext={() => nextStep()} />}
                {step === 2 && (
                  <Step2 onNext={nextStep} onBack={exitAddProject} />
                )}
                {step === 3 && (
                  <Step3 onBack={exitAddProject} onFinish={finishAddProject} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AddProjectProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AddProjectProvider>
  );
}
