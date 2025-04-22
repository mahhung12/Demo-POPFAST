"use client";

import { createSite } from "@/libs/dashboard/site";
import React, { useState } from "react";

const timezones = ["Asia/Saigon", "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "UTC"];

const isValidTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

interface StepOneFormProps {
  formData: {
    domain: string;
    timezone: string;
  };
  setSiteId: React.Dispatch<React.SetStateAction<string>>;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: any) => void;
}

export default function StepOneForm({ formData, setSiteId, onNext }: StepOneFormProps) {
  const [domain, setDomain] = useState(formData.domain || "");
  const [userTimezone, setUserTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTimezone = e.target.value;
    if (isValidTimezone(selectedTimezone)) {
      setUserTimezone(selectedTimezone);
      setError("");
    } else {
      setError("Invalid time zone specified.");
    }
  };

  const handleAddWebsite = async () => {
    if (!domain) {
      setError("Domain is required.");
      return;
    }
    if (!isValidTimezone(userTimezone)) {
      setError("Invalid time zone specified.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSite({
        domain,
        timezone: userTimezone,
        name: domain,
      });

      if (result) {
        setSiteId(result.site.id);
        onNext({
          domain,
          timezone: userTimezone,
        });
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the site.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-inherit rounded-md border border-gray-200 overflow-hidden text-gray-700">
      <div className="p-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Add a new website</h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label htmlFor="domain" className="block text-sm font-medium mb-2">
            Domain
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 bg-inherit border border-r-0 border-gray-200 bg-gray-200 rounded-l-md text-sm">
              https://
            </span>
            <input
              type="text"
              id="domain"
              className="flex-1 bg-inherit border border-gray-200 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder:text-zinc-400"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="timezone" className="block text-sm font-medium mb-2">
            Timezone
          </label>
          <div className="flex">
            <select
              id="timezone"
              className="flex-1 bg-inherit border border-gray-200 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder:text-zinc-400"
              value={userTimezone}
              onChange={handleTimezoneChange}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <span className="inline-flex items-center px-3 py-2 bg-inherit border border-l-0 border-gray-200 rounded-r-md text-sm text-zinc-400">
              where time is {new Date().toLocaleTimeString("en-US", { timeZone: userTimezone })}
            </span>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          <p className="mt-2 text-xs text-zinc-400">This defines what &quot;today&quot; means in your reports</p>
        </div>

        <button
          type="button"
          className={`w-full bg-orange-400 hover:bg-orange-600 py-2 px-4 rounded-md transition-colors font-medium text-white ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddWebsite}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add website"}
        </button>
      </div>
    </div>
  );
}
