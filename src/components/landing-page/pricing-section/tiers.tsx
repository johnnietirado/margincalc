"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/server/actions/create-checkout-session";
import { motion, useInView } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface Tier {
  id: string;
  name: string;
  description: string;
  priceMonthly: string;
  features: string[];
  mostPopular: boolean;
  stripePriceId?: string;
}

interface PricingSectionProps {
  initialTiers: Tier[];
}

export default function Tiers({ initialTiers }: PricingSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [tiers] = useState<Tier[]>(initialTiers);
  const router = useRouter();

  const handleBuyPlan = async (tier: Tier) => {
    if (tier.stripePriceId) {
      try {
        const { url } = await createCheckoutSession(tier.stripePriceId);
        router.push(url);
      } catch (error) {
        console.error("Failed to create checkout session:", error);
      }
    } else {
      // Handle the case where there's no Stripe product ID
      console.error("No Stripe product ID available for this tier");
    }
  };

  return (
    <div className="py-24 sm:pt-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-base font-semibold leading-7 text-primary"
            id="pricing"
          >
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
          Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
          quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                tierIdx === 0 ? "lg:rounded-r-none" : "",
                tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 dark:bg-secondary dark:ring-gray-700 xl:p-10"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={cn(
                      tier.mostPopular
                        ? "text-primary"
                        : "text-gray-900 dark:text-gray-100",
                      "text-lg font-semibold leading-8"
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary dark:bg-indigo-600/20">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-sm font-semibold leading-6">
                    /month
                  </span>
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  ref={ref}
                >
                  {tier.features.map((feature) => (
                    <motion.li
                      key={feature}
                      className="flex gap-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckIcon
                        className="h-6 w-5 flex-none text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 dark:text-gray-100">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <Button
                aria-describedby={tier.id}
                className={cn("mt-8")}
                variant={tier.mostPopular ? "default" : "outline"}
                onClick={() => handleBuyPlan(tier)}
              >
                Buy plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
