import { Component, createEffect, createSignal, For, Show } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import { checkAuth } from "./use_auth";

type FaqItem = {
  question: string;
  answer: JSX.Element;
};

const faqData: FaqItem[] = [
  {
    question: "Can I try out Commonly Odd for free?",
    answer: (
      <p>
        Yes, you can enjoy a free 7-day trial to experience all that Commonly
        Odd has to offer. Your payment method will not be charged until the
        trial period ends. Should you decide it's not the game for you, simply
        cancel your subscription before the trial expires to avoid any charges.
      </p>
    ),
  },
  {
    question: "What types of categories are available in Commonly Odd?",
    answer: (
      <p>
        Currently, the game features a dynamic mix of categories. We are
        actively developing the option to select individual categories and
        topics, aiming to enhance your gaming experience soon.
      </p>
    ),
  },
  {
    question:
      "What is the maximum number of participants in a group voice chat?",
    answer: (
      <p>Each voice chat session can accommodate up to 10 participants.</p>
    ),
  },
  {
    question: "Why do some of the images in the game look unusual?",
    answer: (
      <p>
        We utilize generative AI technology to create the images within Commonly
        Odd. While this innovative approach may occasionally result in
        unexpected image distortions, we are continually improving the image
        quality and appreciate your patience.
      </p>
    ),
  },
  {
    question: "How many people can participate in the game simultaneously?",
    answer: (
      <p>
        There is no upper limit to the number of players who can join a game
        session through the shared link. However, please note that group voice
        calls are limited to 10 participants.
      </p>
    ),
  },
  {
    question: "How many games can be played in a single session?",
    answer: (
      <p>
        Players can engage in an unlimited number of games within each session.
      </p>
    ),
  },
  {
    question: "How many sessions or games can I create?",
    answer: (
      <p>
        You can initiate an unlimited number of games, though you can only
        manage one active session at a time.
      </p>
    ),
  },
  {
    question: "What should I do if I can't start my game?",
    answer: (
      <p>
        If you encounter issues starting your game, we recommend ending the
        current session and starting a new one. This typically resolves most
        problems.
      </p>
    ),
  },
  {
    question: "Can I update or cancel my membership at any time?",
    answer: (
      <p>
        Yes, managing your subscription is straightforward. Simply access
        ‘Manage Subscription’ on our website to be redirected to Stripe’s
        billing page, where you can update or cancel your plan as needed.
      </p>
    ),
  },
  {
    question: "How can I delete my account and membership?",
    answer: (
      <p>
        To delete your account, navigate to ‘Delete Account’ in the settings
        menu, and follow the prompts to remove your profile and subscription.
      </p>
    ),
  },
  {
    question:
      "I found an error in one of the questions, where can I notify you about it?",
    answer: (
      <p>
        If you encounter any errors or issues in the game, please don't hesitate
        to inform us. You can email us at{" "}
        <a href="mailto:commonlyoddtrivia@gmail.com" class="text-blue-400">
          commonlyoddtrivia@gmail.com
        </a>{" "}
        or reach out to{" "}
        <a href="https://twitter.com/kolourrmusic" class="text-blue-400">
          Bruce
        </a>{" "}
        via Twitter.
      </p>
    ),
  },
  {
    question: "Where can I send suggestions for the game?",
    answer: (
      <p>
        We welcome your feedback and suggestions! Please email us at{" "}
        <a href="mailto:commonlyoddtrivia@gmail.com" class="text-blue-400">
          commonlyoddtrivia@gmail.com
        </a>{" "}
        or reach out to{" "}
        <a href="https://twitter.com/kolourrmusic" class="text-blue-400">
          Bruce
        </a>{" "}
        via Twitter.
      </p>
    ),
  },
  {
    question: "Is there a community forum for Commonly Odd?",
    answer: (
      <p>
        Join our vibrant community on Reddit to connect with other players and
        discuss the game. Visit our{" "}
        <a href="https://www.reddit.com/r/commonlyodd/" class="text-blue-400">
          Subreddit
        </a>
        .
      </p>
    ),
  },
  {
    question: "How can I contact you?",
    answer: (
      <p>
        For any inquiries, feel free to email us at{" "}
        <a href="mailto:commonlyoddtrivia@gmail.com" class="text-blue-400">
          commonlyoddtrivia@gmail.com
        </a>{" "}
        or reach out to{" "}
        <a href="https://twitter.com/kolourrmusic" class="text-blue-400">
          Bruce
        </a>{" "}
        via Twitter.
      </p>
    ),
  },
];

const FAQ: Component = () => {
  const [selected, setSelected] = createSignal<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  const toggle = (index: number) => {
    if (selected() === index) {
      setSelected(null);
    } else {
      setSelected(index);
    }
  };

  return (
    <>
      <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900">
        <div class="flex flex-col max-w-5xl mx-auto min-h-screen bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-200 px-6">
          <Show when={isAuthenticated()}>
            <Header />
          </Show>{" "}
          <div class="flex flex-col gap-4 py-10">
            <div class="text-4xl font-bold text-center mb-5">FAQ</div>
            <For each={faqData}>
              {(item, index) => (
                <div class="border-b border-gray-600">
                  <button
                    class="w-full text-left p-4 font-semibold text-lg"
                    onClick={() => toggle(index())}
                  >
                    {item.question}
                  </button>
                  <div
                    class={`transition-max-height duration-300 ease-in-out ${
                      selected() === index() ? "max-h-screen" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <div class="p-4">{item.answer}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FAQ;
