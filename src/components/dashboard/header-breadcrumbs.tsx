"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function HeaderBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link href={`/${segments.slice(0, index + 1).join("/")}`}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < segments.length - 1 && (
              <BreadcrumbSeparator key={segment} />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
