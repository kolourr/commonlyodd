import { Component } from "solid-js";

const Footer: Component = () => {
  const handleCommunitySupport = () => {
    window.open("https://www.reddit.com/r/commonlyodd/", "_blank");
  };

  const handleContactUs = () => {
    window.open("/contact-us", "_blank");
  };

  const handlePrivacyPolicy = () => {
    window.open("/privacy-policy", "_blank");
  };

  const handleTermsOfUse = () => {
    window.open("/terms-of-use", "_blank");
  };

  return (
    <footer class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900 text-gray-50 p-4 text-center">
      <a href="#" onClick={handlePrivacyPolicy} class="hover:underline">
        Privacy Policy{" "}
      </a>
      |{" "}
      <a href="#" onClick={handleTermsOfUse} class="hover:underline">
        Terms of Use{" "}
      </a>
      |{" "}
      <a href="#" onClick={handleCommunitySupport} class="hover:underline">
        Community Support{" "}
      </a>
      |{" "}
      <a href="#" onClick={handleContactUs} class="hover:underline">
        Contact Us{" "}
      </a>
      <p class="mt-4">
        Made with love ❤️ by{" "}
        <a
          href="https://twitter.com/kolourrmusic"
          target="_blank"
          class="underline hover:text-gray-100 "
        >
          Bruce
        </a>
      </p>
    </footer>
  );
};

export default Footer;
