import React from "react";
import WorkCard from "@/ui/cards/WorkCard";
import Link from "next/link";
import Hero from "@/ui/hero/Hero";

import { workItems, otherActions } from "@/data/services";

const Section = ({ title, children }) => (
  <section>
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-bold text-secondary tracking-tight">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
    </div>
    <div
      className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
    "
    >
      {children}
    </div>
  </section>
);

export default function Dashboard() {
  return (
    <div className="min-h-full w-full max-w-7xl mx-auto p-4 col-span-4 space-y-10">
      <Hero />

      {/* Assign Work */}
      <Section title="Assign Work">
        {workItems.map((item) => (
          <WorkCard key={item.name} {...item} />
        ))}
      </Section>

      {/* Other Actions */}
      <Section title="Services">
        {otherActions.map((item) => (
          <WorkCard key={item.button} {...item} />
        ))}
      </Section>
    </div>
  );
}
