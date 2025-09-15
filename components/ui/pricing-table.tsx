import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, LucideIcon, MinusIcon } from "lucide-react";
import { Badge } from "./badge";

function PricingTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

function PricingTableHeader({ ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />;
}

function PricingTableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr]:divide-x [&_tr]:border-b", className)}
      {...props}
    />
  );
}

function PricingTableRow({ ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" {...props} />;
}

function PricingTableCell({
  className,
  children,
  ...props
}: React.ComponentProps<"td"> & { children: React.ReactNode }) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-4 align-middle whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </td>
  );
}

function PricingTableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "p-2 text-left align-middle font-medium whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

function PricingTablePlan({
  name,
  badge,
  price,
  compareAt,
  icon: Icon,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & PricingPlanType) {
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)]",
        className,
      )}
      {...props}
      style={{ filter: "url(#glass-effect)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-white/10 p-2 backdrop-blur-sm">
          {Icon && <Icon className="h-5 w-5 text-amber-300" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <Badge
            variant="secondary"
            className="mt-1 rounded-full bg-white/10 text-white/80 px-3 py-1 text-xs font-normal"
          >
            {badge}
          </Badge>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <span className="text-3xl font-bold text-white">{price}</span>
        {compareAt && (
          <span className="text-muted-foreground text-sm line-through ml-2">
            {compareAt}
          </span>
        )}
      </div>
      <div className="relative z-10 mt-6">{children}</div>
    </div>
  );
}

type PricingPlanType = {
  name: string;
  icon: LucideIcon;
  badge: string;
  price: string;
  compareAt?: string;
};

type FeatureValue = boolean | string;

type FeatureItem = {
  label: string;
  values: FeatureValue[];
};

export {
  type PricingPlanType,
  type FeatureValue,
  type FeatureItem,
  PricingTable,
  PricingTableHeader,
  PricingTableBody,
  PricingTableRow,
  PricingTableHead,
  PricingTableCell,
  PricingTablePlan,
};
