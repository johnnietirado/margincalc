"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export function DashboardGuide() {
  const steps = [
    {
      title: "Create a New Product",
      description: "Start by creating a new product in the products dashboard.",
      link: "/dashboard/products",
      linkText: "Go to Products",
    },
    {
      title: "Manage Users",
      description: "Once your product is set up, you can manage your users.",
      link: "/dashboard/users",
      linkText: "Manage Users",
    },
    {
      title: "Modify Account Settings",
      description: "Update your account settings as needed.",
      link: "/dashboard/settings",
      linkText: "Account Settings",
    },
  ];

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Dashboard Guide</CardTitle>
        <CardDescription>
          This is an example guide to help you get started with this template.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="ml-4">
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {steps.map((step, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary ring-4 ring-white dark:bg-primary dark:ring-gray-900">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mb-1 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <time className="mb-2 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Step {index + 1}
                </time>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
                <Link
                  href={step.link}
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:z-10 focus:outline-none focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/80"
                >
                  {step.linkText}
                  <svg
                    className="ml-2 h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
