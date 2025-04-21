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
      // Call the createSite function
      // const result = await createSite({
      //   domain: formData.domain,
      //   timezone: formData.timezone,
      //   name: "My Website", // Replace with a dynamic name if needed
      // });

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
    <div>
      <p className="text-lg font-medium text-white mb-4">Install the DataFast script</p>
      <p className="text-sm text-zinc-400 mb-6">
        Paste this snippet in the <code>&lt;head&gt;</code> of your website.
      </p>
      <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 relative">
        <pre className="text-sm text-zinc-300 overflow-x-auto">
          <code className="whitespace-pre-wrap">{scriptSnippet}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1 rounded-md transition-colors"
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleCheckAndRedirect}
          className={`bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors ${
            isChecking ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Show the magic"}
        </button>
      </div>
    </div>
  );
}
