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

  const handleFAQ = () => {
    window.open("/faq", "_blank");
  };

  const handleCookiePolicy = () => {
    window.open("/cookie-policy", "_blank");
  };

  return (
    <footer class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900 text-gray-50 p-4 text-center">
      <a onClick={handlePrivacyPolicy} class="hover:underline">
        Privacy Policy{" "}
      </a>
      |{" "}
      <a onClick={handleTermsOfUse} class="hover:underline">
        Terms of Use{" "}
      </a>
      |{" "}
      <a onClick={handleCookiePolicy} class="hover:underline">
        Cookie Policy{" "}
      </a>
      |{" "}
      <a onClick={handleFAQ} class="hover:underline">
        FAQ{" "}
      </a>
      |{" "}
      <a onClick={handleCommunitySupport} class="hover:underline">
        Community Support{" "}
      </a>
      |{" "}
      <a onClick={handleContactUs} class="hover:underline">
        Contact Us{" "}
      </a>
      <p class="mt-4">
        Made with ❤️ by{" "}
        <a
          href="https://twitter.com/kolourrmusic"
          target="_blank"
          class="  hover:text-gray-100 "
        >
          Bruce
        </a>
      </p>
    </footer>
  );
};

export default Footer;
