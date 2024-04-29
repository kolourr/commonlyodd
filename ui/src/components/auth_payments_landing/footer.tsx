import { Component } from "solid-js";

const Footer: Component = () => {
  const handleCommunitySupport = () => {
    window.open("https://www.reddit.com/r/commonlyodd/", "_blank");
  };

  const handleHome = () => {
    window.location.href = "/";
  };
  const handleContactUs = () => {
    window.location.href = "/contact-us";
  };

  const handlePrivacyPolicy = () => {
    window.location.href = "/privacy-policy";
  };

  const handleTermsOfUse = () => {
    window.location.href = "/terms-of-use";
  };

  const handleFAQ = () => {
    window.location.href = "/faq";
  };

  const handleCookiePolicy = () => {
    window.location.href = "/cookie-policy";
  };

  const handleRules = () => {
    window.location.href = "/rules";
  };

  return (
    <footer class="bg-gradient-to-r from-slate-900 via-zinc-950   to-slate-900 text-gray-300 p-4 text-center">
      <a onClick={handleHome} class="hover:underline">
        Home{" "}
      </a>
      |{" "}
      <a onClick={handleRules} class="hover:underline">
        Rules{" "}
      </a>
      |{" "}
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
          Bruce in Toronto
        </a>
      </p>
      <p>&copy; I Lov Guitars Inc.</p>
    </footer>
  );
};

export default Footer;
