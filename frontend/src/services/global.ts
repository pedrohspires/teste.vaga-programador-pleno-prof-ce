import type { ReactNode } from "react";

export type ChildrenType = {
    children: ReactNode
}

export type selectOptionType<T> = {
    value: T;
    label: string;
}