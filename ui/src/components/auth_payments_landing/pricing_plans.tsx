import {
  Component,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
} from "solid-js";
import { Button } from "@suid/material";
import {
  createCheckoutSessionMonthly,
  createCheckoutSessionYearly,
} from "./pricing";
import { checkAuth } from "./use_auth";

const BASE_API = import.meta.env.CO_API_URL;

interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string[];
  savings?: string;
  isBestValue: boolean;
  checkoutSession: () => void;
}

const plans: Plan[] = [
  {
    id: "yearly",
    title: "Yearly Plan",
    price: "$60",
    period: "year",
    savings: "Save 44% with this plan!",
    description: [
      "No download needed",
      "Friends and family play for FREE",
      "Group Voice chat included for FREE",
      "Learn and have fun at the same time",
      "Request new categories",
      "Frequent updates",
    ],
    isBestValue: true,
    checkoutSession: createCheckoutSessionYearly,
  },
  {
    id: "monthly",
    title: "Monthly Plan",
    price: "$9",
    period: "month",
    description: [
      "No download needed",
      "Friends and family play for FREE",
      "Group Voice chat included for FREE",
      "Learn and have fun at the same time",
      "Request new categories",
      "Frequent updates",
    ],
    isBestValue: false,
    checkoutSession: createCheckoutSessionMonthly,
  },
];

export const [isAuthenticated, setIsAuthenticated] = createSignal(false);

const PricingPlans = () => {
  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  return (
    <div class="flex flex-col lg:flex-row justify-center items-stretch gap-4 p-4 bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      {plans.map((plan) => (
        <div
          class={`p-6 rounded-lg text-center shadow-lg ${
            plan.isBestValue ? " border-4 border-success-300" : "  border-2"
          } flex flex-col justify-between w-[355px]  `}
          key={plan.id}
        >
          <div>
            <h3 class="text-4xl font-bold mb-2">{plan.title}</h3>
            <div class="flex flex-row justify-center items-baseline">
              <p class="text-4xl font-bold text-gray-200">{plan.price}</p>
              <p class="text-2xl italic font-bold pl-2 text-gray-400">
                {plan.period}
              </p>
            </div>
            {plan.savings ? (
              <p class="text-2xl font-bold text-success-400 mt-1">
                {plan.savings}
              </p>
            ) : (
              <p class="text-2xl font-bold text-transparent mt-1">
                Placeholder
              </p>
            )}
          </div>
          <ul class="list-none text-left mt-2 mb-4 flex-grow text-gray-300">
            {plan.description.map((feature, index) => (
              <li key={index} class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    class="w-4 h-4  "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <Switch>
            <Match when={isAuthenticated()}>
              <Button
                variant="contained"
                color="secondary"
                onClick={plan.checkoutSession}
                class="w-full mt-2"
              >
                Start Playing for Free
              </Button>
            </Match>
            <Match when={!isAuthenticated()}>
              <Button
                variant="contained"
                color="secondary"
                href={`${BASE_API}/login`}
                class="w-full mt-2"
              >
                Start Playing for Free
              </Button>
            </Match>
          </Switch>
        </div>
      ))}
    </div>
  );
};

export default PricingPlans;
