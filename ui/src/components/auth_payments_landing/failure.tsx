import { Show, createEffect, createResource } from "solid-js";
import { Button } from "@suid/material";
import { fetchUserProfile } from "./user_profile";
import {
  createCheckoutSessionMonthly,
  createCheckoutSessionYearly,
} from "./pricing";
import { stripePortal } from "./stripe_portal";
import { userSubstatus } from "./subscription_status";

const BASE_API = import.meta.env.CO_API_URL;

const Failure = () => {
  const [userProfile] = createResource(fetchUserProfile);

  return (
    <div class="flex flex-col items-center justify-center ">
      <h1 class="mb-4 text-2xl font-bold">
        Sorry, {userProfile()?.firstName}, the payment failed!
      </h1>
      <img src={userProfile()?.pictureURL} alt="Profile Picture" class="mb-4" />
      <div class="p-4">
        <Button variant="contained" color="primary" href={`${BASE_API}/logout`}>
          Logout
        </Button>
      </div>
      <div class="p-4">
        <Button variant="contained" color="secondary" href="/game">
          Play Game
        </Button>
      </div>
      <div class="p-4">
        <Button
          variant="contained"
          color="secondary"
          onClick={createCheckoutSessionMonthly}
        >
          Start Checkout Monthly
        </Button>
      </div>

      <div class="p-4">
        <Button
          variant="contained"
          color="secondary"
          onClick={createCheckoutSessionYearly}
        >
          Start Checkout Yearly
        </Button>
      </div>
      <Show when={userSubstatus()}>
        <div class="p-4">
          <Button variant="contained" color="secondary" onClick={stripePortal}>
            Stripe Portal
          </Button>
        </div>
      </Show>
    </div>
  );
};

export default Failure;
