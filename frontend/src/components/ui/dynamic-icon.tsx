import * as FaIcons from "react-icons/fa";
import * as Hi2Icons from "react-icons/hi2";

type IconProps = {
    name: string;
    size?: number;
    className?: string;
};

export default function DynamicIcon({ name, size = 20, className }: IconProps) {
    const IconComponent = (FaIcons as any)[name] || (Hi2Icons as any)[name];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent size={size} className={className} />;
}
