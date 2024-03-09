import { Show, createEffect, createResource, onMount } from "solid-js";
import { Button } from "@suid/material";
import { checkSubStatus, userSubstatus } from "./subscription_status";
import { fetchUserProfile } from "./user_profile";
import { stripePortal } from "./stripe_portal";

const BASE_API = import.meta.env.CO_API_URL;

const Success = () => {
  // Create resource to fetch user profile
  const [userProfile] = createResource(fetchUserProfile);

  createEffect(() => {
    checkSubStatus();
  });

  onMount(() => {
    checkSubStatus();
  });

  return (
    <div class="flex flex-col items-center justify-center ">
      <h1 class="mb-4 text-2xl font-bold">
        Horrah! {userProfile()?.firstName}, the payment is a success!
      </h1>
      <img src={userProfile()?.pictureURL} alt="Profile Picture" class="mb-4" />
      <div class="p-4">
        <Button variant="contained" color="primary" href={`${BASE_API}/logout`}>
          Logout
        </Button>
      </div>
      <Show when={userSubstatus()}>
        <div class="p-4">
          <Button variant="contained" color="secondary" href="/game">
            Play Game
          </Button>
        </div>
      </Show>
      <div class="p-4">
        <Button variant="contained" color="secondary" onClick={stripePortal}>
          Stripe Portal
        </Button>
      </div>
    </div>
  );
};

export default Success;
