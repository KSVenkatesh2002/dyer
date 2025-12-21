import { cn } from "@/lib/utilty/cn";
import Image from "next/image";
import Link from "next/link";

const WorkCard = ({ name, purpose, image, href, button }) => (
  <Link
    href={href}
    className={cn(
      "group relative rounded-3xl overflow-hidden",
      "bg-surfaceSoft border border-secondary",
      "shadow-lg hover:shadow-glow",
      "transition-all duration-300 hover:-translate-y-1"
    )}
  >
    {/* Glow border */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

    {/* Image */}
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
      <Image
        src={image}
        alt={name || button}
        fill
        priority
        className={cn(
          "object-contain",
          "p-6",
          "transition-transform",
          "duration-300",
          "ease-out",
          "group-hover:scale-[1.03]"
        )}
      />
    </div>

    {/* Content */}
    <div className="relative z-10 px-5 pb-6 text-center">
      <h3 className="text-lg font-semibold text-textMain uppercase tracking-wide">
        {name}
      </h3>

      <p className="text-sm text-textMain/70 mt-1">{purpose}</p>

      <span
        className="
          inline-block mt-4 px-4 py-1.5 text-sm font-medium rounded-full
          bg-primary/20 text-primary
          group-hover:bg-primary group-hover:text-white
          transition
        "
      >
        {button}
      </span>
    </div>
  </Link>
);

export default WorkCard;
