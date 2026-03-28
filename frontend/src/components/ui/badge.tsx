import { cva, type VariantProps } from "class-variance-authority";
import { classNames } from "../../utils/classNames";

const badgeVariants = cva(
    "inline-flex items-center rounded-full font-medium transition-colors select-none drop-shadow-sm",
    {
        variants: {
            variant: {
                default: "bg-zinc-900 text-white",
                secondary: "bg-zinc-200 text-zinc-900",
                success: "bg-emerald-100 text-emerald-600",
                warning: "bg-amber-100 text-amber-600",
                danger: "bg-red-100 text-red-600",
                outline: "border border-zinc-300 text-zinc-900",
            },
            size: {
                sm: "text-xs px-2 py-0.5",
                md: "text-sm px-3 py-1",
                lg: "text-base px-4 py-1.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({
    className,
    variant,
    size,
    ...props
}: BadgeProps) {
    return (
        <span
            className={classNames(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}