import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbWrapperProps {
  routes: string[];
  className?: string;
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({ routes, className }) => {
  return (
    <Breadcrumb className={cn(className, "p-4")}>
      <BreadcrumbList>
        {routes.map((route, index) => {
          // If it's the last item, we use BreadcrumbPage instead of BreadcrumbLink
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <BreadcrumbSeparator>
                  {" "}
                  <ChevronRight />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {index === routes.length - 1 ? (
                  <BreadcrumbPage>{route}</BreadcrumbPage>
                ) : (
                  <Link
                    className="px-1 py-3 text-[#333333] transition-colors hover:text-foreground"
                    to={`/${route.toLowerCase()}`}
                  >
                    {route}
                  </Link>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbWrapper;
