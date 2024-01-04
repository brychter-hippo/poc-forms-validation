"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PropsWithChildren, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  {
    title: "Zod",
    href: "/zod",
  },
  {
    title: "Yup",
    href: "/yup",
  },
  {
    title: "Native",
    href: "/native",
  },
];

export default function FormsTemplate({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    console.clear();
  }, []);

  return (
    <main className="flex flex-col min-h-screen justify-center items-center gap-10 p-24">
      <div className="flex gap-4">
        {navigation.map(({ title, href }) => (
          <Button
            key={href}
            asChild
            variant={pathname === href ? undefined : "secondary"}
          >
            <Link href={href}>{title}</Link>
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader className="capitalize">
          {navigation.find(({ href }) => href === pathname)?.title}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
