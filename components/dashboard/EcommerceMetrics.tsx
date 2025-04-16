"use client";
import React from "react";
import Image from "next/image";
import Badge from "../ui/badge/Badge";

interface EventData {
  id: string;
  event_type: string;
  metadata: {
    email?: string;
  };
}

interface EcommerceMetricsProps {
  events: EventData[];
}

export const EcommerceMetrics = ({ events }: EcommerceMetricsProps) => {
  // Calculate metrics
  const totalEvents = events.length;
  const signupOAuthCount = events.filter((e) => e.event_type === "signup_oauth").length;
  const signupMagicLinkCount = events.filter((e) => e.event_type === "signup_magic_link").length;
  const checkoutCount = events.filter((e) => e.event_type === "checkout").length;

  // Calculate unique users (if email is available)
  const uniqueUsers = new Set(events.map((e) => e.metadata.email).filter(Boolean)).size;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Events */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/box-line.svg" alt="Total Events Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Total Events</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{totalEvents}</h4>
          </div>
          <Badge color="success">
            <Image src="/icons/arrow-up.svg" alt="Arrow Up Icon" width={16} height={16} className="inline-block mr-1" />
            +{((totalEvents / 100) * 10).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Unique Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/group.svg" alt="Unique Users Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Unique Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{uniqueUsers}</h4>
          </div>
          <Badge color="success">
            <Image src="/icons/arrow-up.svg" alt="Arrow Up Icon" width={16} height={16} className="inline-block mr-1" />
            +{((uniqueUsers / 100) * 10).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Signup OAuth */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/user-line.svg" alt="Signup OAuth Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Signup (OAuth)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{signupOAuthCount}</h4>
          </div>
          <Badge color="success">
            <Image src="/icons/arrow-up.svg" alt="Arrow Up Icon" width={16} height={16} className="inline-block mr-1" />
            +{((signupOAuthCount / totalEvents) * 100).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Checkout Events */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/dollar-line.svg" alt="Checkout Events Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Checkout Events</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{checkoutCount}</h4>
          </div>
          <Badge color="error">
            <Image
              src="/icons/arrow-down.svg"
              alt="Arrow Down Icon"
              width={16}
              height={16}
              className="inline-block mr-1"
            />
            -{((checkoutCount / totalEvents) * 100).toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
