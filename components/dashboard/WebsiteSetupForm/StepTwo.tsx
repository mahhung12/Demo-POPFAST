"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface StepTwoFormProps {
  siteId: string;
  formData: {
    domain: string;
    timezone: string;
  };
  onBack: () => void;
}

export default function StepTwoForm({ siteId, formData, onBack }: StepTwoFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const scriptSnippet = `<script
  defer
  data-website-id=${siteId}
  data-domain=${formData.domain}
  src="http://localhost:3000/tracker.js">
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setIsCopied(true);

    // Display toast message
    toast({
      title: "Copied to clipboard",
      description: "The script snippet has been copied successfully.",
    });

    // Reset the "Copied" state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCheckAndRedirect = async () => {
    setIsChecking(true);

    try {
      // Display success toast
      toast({
        title: "Site Created",
        description: "Your site has been created successfully.",
      });

      // Redirect to the dashboard with the new site ID
      router.push(`/dashboard/${siteId}`);
    } catch (error: any) {
      // Display error toast
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the site.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className=" text-gray-800 border border-gray-200 rounded-md">
      <div className="w-full p-6 py-4 border-b border-gray-200">
        <p className="text-lg font-medium">Install the DataFast script</p>
        <p className="text-sm text-zinc-400 mt-1">
          Paste this snippet in the <code>&lt;head&gt;</code> of your website.
        </p>
      </div>

      <div className="p-6">
        <div className="bg-[#2b2b2b] p-4 rounded-md border border-zinc-700 relative">
          <pre className="text-sm text-zinc-300 overflow-x-auto">
            <code className="whitespace-pre-wrap">{scriptSnippet}</code>
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-xs px-3 py-1 rounded-md transition-colors text-white"
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-inherit border border-gray-200 py-2 px-4 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleCheckAndRedirect}
            className={`w-fit bg-orange-400 hover:bg-orange-600 py-2 px-4 rounded-md transition-colors font-medium text-white ${
              isChecking ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Show the magic"}
          </button>
        </div>
      </div>
    </div>
  );
}
