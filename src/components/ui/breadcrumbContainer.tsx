import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Skeleton } from "./skeleton";

type BreadcrumbContainerProps = {
  link: string;
  prevPage: string;
  currentPage: string;
};

export const BreadcrumbContainer = ({
  link,
  prevPage,
  currentPage,
}: BreadcrumbContainerProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={link}>{prevPage}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {currentPage === "" ? (
              <Skeleton className="w-40 h-8" />
            ) : (
              currentPage ?? ""
            )}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
