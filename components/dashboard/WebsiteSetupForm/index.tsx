"use client";

import Link from "next/link";
import { useState } from "react";
import StepOneForm from "./StepOne";
import StepTwoForm from "./StepTwo";
import { deleteSite } from "@/libs/dashboard/site";

export default function WebsiteSetupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: "",
    timezone: "",
  });
  const [siteId, setSiteId] = useState("");

  const handleNext = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // New: handle dashboard click and delete site if exists
  const handleDashboardClick = async () => {
    if (siteId) {
      try {
        await deleteSite(siteId);
        setSiteId("");
      } catch (error) {
        console.error("Failed to delete site:", error);
      }
    }
    // Navigate to dashboard (Link will handle navigation)
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneForm setSiteId={setSiteId} onNext={handleNext} formData={formData} />;
      case 2:
        return <StepTwoForm siteId={siteId} onBack={handleBack} formData={formData} />;
      default:
        return null;
    }
  };

  const steps = [
    { step: 1, label: "Add site" },
    { step: 2, label: "Install script" },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <button
              className="px-4 py-2 rounded-md bg-gray-200 border bg-inherit !text-black transition-colors flex items-center gap-2 hover:bg-gray-100"
              onClick={handleDashboardClick}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4.5-4.5M3 12l4.5 4.5" />
              </svg>
              Dashboard
            </button>
          </Link>
        </div>

        {/* Steps */}
        <div className="border-red-500 w-full mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-12 mb-8 w-full">
            {steps.map(({ step, label }) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    currentStep === step ? "bg-orange-500" : "bg-zinc-700"
                  } flex items-center justify-center text-xs`}
                >
                  {step}
                </div>
                <span className={`${currentStep === step ? "text-orange-500" : "text-zinc-400"} text-sm`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="w-full border-red-300 rounded-lg">{renderStep()}</div>

          <div className="mt-4 text-center text-xs text-zinc-500">
            Need help? Email{" "}
            <a href="mailto:popfast@gmail.com" className="text-zinc-400 hover:underline">
              popfast@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
