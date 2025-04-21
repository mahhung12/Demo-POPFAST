'use client'

import Link from "next/link";
import { useState } from "react";
import StepOneForm from "./StepOne";
import StepTwoForm from "./StepTwo";

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

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3F3F46] rounded-md text-sm hover:bg-zinc-700 transition-colors"
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
          </Link>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-24 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full ${
                currentStep === 1 ? "bg-orange-500" : "bg-zinc-700"
              } flex items-center justify-center text-xs`}
            >
              1
            </div>
            <span className={`${currentStep === 1 ? "text-orange-500" : "text-zinc-400"} text-sm`}>Add site</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full ${
                currentStep === 2 ? "bg-orange-500" : "bg-zinc-700"
              } flex items-center justify-center text-xs`}
            >
              2
            </div>
            <span className={`${currentStep === 2 ? "text-orange-500" : "text-zinc-400"} text-sm`}>Install script</span>
          </div>
        </div>

        <div className="bg-[#3F3F46] rounded-lg overflow-hidden">
          <div className="p-6">{renderStep()}</div>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          Need help? Email{" "}
          <a href="mailto:popfast@gmail.com" className="text-zinc-400 hover:text-white">
            popfast@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
