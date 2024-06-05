import { Component, createSignal, For } from "solid-js";

type FaqItem = {
  question: string;
  answer: JSX.Element;
};

const faqData: FaqItem[] = [
  {
    question: "Can I try out Commonly Odd for free?",
    answer: (
      <>
        <p class="mb-2">
          Yes, absolutely! No credit card is required. All you need to do is
          sign in.
        </p>
        <p>
          Once the trial is complete, you can choose to subscribe to the game
          for a small monthly or yearly fee if you wish to continue playing.
        </p>
      </>
    ),
  },
  {
    question: "What types of categories are available in Commonly Odd?",
    answer: (
      <p>
        Currently, the game allows for the individual selection of: baseball,
        hockey, basketball, football, 80's, harry potter, bible and random (this
        includes but is not limited to philosophy, rome, world history, food
        etc.). New categories are added daily and we welcome your suggestions
        for additional topics as well.
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
        current session/game and starting a new one. This typically resolves
        most problems.
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
        <a href="mailto:bruce@commonlyodd.com" class="text-blue-400">
          bruce@commonlyodd.com
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
        <a href="mailto:bruce@commonlyodd.com" class="text-blue-400">
          bruce@commonlyodd.com
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
        <a
          href="https://www.reddit.com/r/commonlyoddtrivia/"
          class="text-blue-400"
        >
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
        <a href="mailto:bruce@commonlyodd.com" class="text-blue-400">
          bruce@commonlyodd.com
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

const FAQitems: Component = () => {
  const [selected, setSelected] = createSignal<number | null>(null);

  const toggle = (index: number) => {
    if (selected() === index) {
      setSelected(null);
    } else {
      setSelected(index);
    }
  };

  return (
    <>
      <div class=" py-10     mx-auto  mt-8 mb-2  ">
        <div class="text-3xl font-bold text-center mb-5">
          Frequently Asked Questions
        </div>
        <div class="grid lg:grid-cols-2 gap-4 ">
          <For each={faqData}>
            {(item, index) => (
              <div class="border-b border-gray-600">
                <button
                  class="w-full text-left p-4 text-slate-300  text-lg "
                  onClick={() => toggle(index())}
                >
                  {item.question}
                </button>
                <div
                  class={`transition-max-height text-slate-400 duration-300 ease-in-out ${
                    selected() === index() ? "max-h-screen" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div class="p-4">{item.answer}</div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
};

export default FAQitems;
