import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { Box, Button } from "@suid/material";
import Header from "./header";
import Footer from "./footer";
import { checkAuth } from "./use_auth";
import HeaderMobile from "./header_mobile";

interface SubmitResult {
  error?: string;
  message?: string;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.CO_GOOGLE_RECAPTCHA_SITE_KEY;

const ContactUsForm: Component = () => {
  const [name, setName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [subject, setSubject] = createSignal<string>("");
  const [message, setMessage] = createSignal<string>("");
  const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
  const [submitResult, setSubmitResult] = createSignal<SubmitResult | null>(
    null
  );
  const [captchaResponse, setCaptchaResponse] = createSignal("");
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

  onMount(() => {
    if (window.grecaptcha) {
      window.grecaptcha.render("recaptcha-container", {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (response) => {
          setCaptchaResponse(response);
        },
        "expired-callback": () => {
          setCaptchaResponse("");
        },
      });
    } else {
      console.error("grecaptcha not loaded");
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      name: name(),
      email: email(),
      subject: subject(),
      message: message(),
      "g-recaptcha-response": captchaResponse(),
    };

    try {
      const response = await fetch(`${import.meta.env.CO_API_URL}/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result: SubmitResult = await response.json();
      setSubmitResult(result);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      window.grecaptcha.reset();
    } catch (error: any) {
      setSubmitResult({ error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  const emailRegex = /\S+@\S+\.\S+/;

  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <div class="hidden md:block">
          {" "}
          <Header />
        </div>
        <div class="block md:hidden">
          <HeaderMobile />
        </div>

        <div class="flex flex-col gap-4">
          <div class="text-3xl font-bold text-center">Contact Us</div>
          <div class="text-xl   text-center">
            If you have any questions or concerns, please complete this form
            below.
          </div>

          <form
            onSubmit={handleSubmit}
            class="text-center mx-auto my-2 flex flex-col gap-6 w-8/12"
          >
            <input
              type="text"
              class="text-gray-200 bg-transparent border-2 shadow-md shadow-gray-50 h-14"
              required
              placeholder=" Name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
            />
            <input
              type="email"
              class="text-gray-200 bg-transparent border-2 shadow-md shadow-gray-50 h-14"
              required
              placeholder=" Email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              style={{ borderColor: emailRegex.test(email()) ? "gray" : "red" }}
            />
            <input
              type="text"
              class="text-gray-200 bg-transparent border-2 shadow-md shadow-gray-50 h-14"
              required
              placeholder=" Subject"
              value={subject()}
              onInput={(e) => setSubject(e.currentTarget.value)}
            />
            <textarea
              class="text-gray-200 bg-transparent border-2 shadow-md shadow-gray-50  "
              required
              placeholder=" Message"
              rows="8"
              cols="50"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
            ></textarea>
            <div
              id="recaptcha-container"
              class="flex justify-center items-center"
            ></div>

            <div class="flex justify-center items-center">
              {" "}
              <Button
                type="submit"
                disabled={isSubmitting()}
                sx={{
                  mt: 2,
                  color: "#f9fafb",
                  width: 150,
                  height: 50,
                }}
                class="flex justify-center items-center bg-gradient-to-bl from-warning-800 to-error-800"
              >
                Submit
              </Button>
            </div>

            <Show when={submitResult()}>
              <div
                class={`mt-2 text-sm ${
                  submitResult()?.error ? "text-error-500" : "text-success-500"
                }`}
              >
                {submitResult()?.error
                  ? `Error: ${submitResult().error}`
                  : "Message sent successfully!"}
              </div>
            </Show>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsForm;
