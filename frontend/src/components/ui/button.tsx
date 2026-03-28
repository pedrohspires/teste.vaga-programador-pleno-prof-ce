import { cva, type VariantProps } from "class-variance-authority";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const buttonVariants = cva(
    "px-6 w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                success: "bg-green-600 text-white hover:bg-green-700",
                default: "bg-blue-600 text-white hover:bg-blue-700",
                secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
                danger: "bg-red-600 text-white hover:bg-red-700",
                outline: "border border-gray-300 hover:bg-gray-100",
            },
            size: {
                sm: "p-1",
                md: "p-1.5",
                lg: "p-3 !text-lg !rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export type ButtonProps = {
    isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, isLoading, children, ...props }: ButtonProps) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
        >
            {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : <></>} {children}
        </button>
    );
}