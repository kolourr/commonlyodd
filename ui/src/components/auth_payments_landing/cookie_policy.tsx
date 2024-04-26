import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";

const CookiePolicy: Component = () => {
  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <Header />
        <main class="flex flex-col gap-4">
          <div class="text-3xl font-bold text-center">Cookie Policy</div>
          <div class="text-center">Effective Date: April 13, 2024</div>
          <div>
            <div>
              This Cookie Policy explains how I Lov Guitars Inc., doing business
              as Commonly Odd ("Company", "we", "us", and "our"), uses cookies
              and similar technologies to recognize you when you visit our
              website at www.commonlyodd.com. It explains what these
              technologies are and why we use them, as well as your rights to
              control our use of them.
            </div>
            <div class="text-xl font-bold py-2">What are cookies?</div>
            <div>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </div>
            <div class="text-xl font-bold py-2">Why do we use cookies?</div>
            <div>
              We use first party and third party cookies for several reasons.
              Some cookies are required for technical reasons in order for our
              Websites to operate, and we refer to these as "essential" or
              "strictly necessary" cookies. Other cookies also enable us to
              track and target the interests of our users to enhance the
              experience on our Websites.
            </div>
            <div class="text-xl font-bold py-2">
              What types of cookies do we use?
            </div>
            <div>
              We use both session and persistent cookies on our website. Here’s
              a list of the types of cookies we use on our website:
              <ul class="list-disc ml-8 py-2">
                <li class="pb-2">
                  Essential Cookies: These cookies are strictly necessary to
                  provide you with services available through our Websites and
                  to use some of its features, such as access to secure areas.
                </li>
                <li class="pb-2">
                  Analytics and Customization Cookies: These cookies collect
                  information that is used either in aggregate form to help us
                  understand how our Websites are being used or how effective
                  our marketing campaigns are, or to help us customize our
                  Websites for you.
                </li>
                <li class="pb-2">
                  Advertising Cookies: These cookies are used to make
                  advertising messages more relevant to you. They perform
                  functions like preventing the same ad from continuously
                  reappearing, ensuring that ads are properly displayed for
                  advertisers, and in some cases selecting advertisements that
                  are based on your interests.
                </li>
              </ul>
            </div>
            <div class="text-xl font-bold pb-2">How can I control cookies?</div>
            <div>
              You have the right to decide whether to accept or reject cookies.
              Essential cookies cannot be rejected as they are strictly
              necessary to provide you with services. if you have any questions,
              please reach out to us at commonlyoddtrivia@gmail.com
            </div>
            <div class="text-xl font-bold py-2">More information</div>
            <div>
              If you have any questions about our use of cookies or other
              technologies, please email us at commonlyoddtrivia@gmail.com.
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
