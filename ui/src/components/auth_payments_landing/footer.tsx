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
      <div class="lg:flex flex-row items-center text-center justify-center">
        <a
          onClick={handleHome}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Home{" "}
        </a>
        |{" "}
        <a
          onClick={handleRules}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Rules{" "}
        </a>
        |{" "}
        <a
          onClick={handlePrivacyPolicy}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Privacy Policy{" "}
        </a>
        |{" "}
        <a
          onClick={handleTermsOfUse}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Terms of Use{" "}
        </a>
        |{" "}
        <a
          onClick={handleCookiePolicy}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Cookie Policy{" "}
        </a>
        |{" "}
        <a
          onClick={handleFAQ}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          FAQ{" "}
        </a>
        |{" "}
        <a
          onClick={handleCommunitySupport}
          class="hover:underline px-2"
          style={{ cursor: "pointer" }}
        >
          Community Support{" "}
        </a>
        <div class="hidden md:block">
          |{" "}
          <a
            onClick={handleContactUs}
            class="hover:underline px-2"
            style={{ cursor: "pointer" }}
          >
            Contact Us{" "}
          </a>
        </div>
      </div>
      <p class="mt-4">
        Made with ❤️ by{" "}
        <a
          href="https://twitter.com/kolourrmusic"
          target="_blank"
          class="  hover:text-gray-100 "
          style={{ cursor: "pointer" }}
        >
          Bruce in Toronto
        </a>
      </p>
      <p>&copy; I Lov Guitars Inc.</p>
    </footer>
  );
};

export default Footer;
