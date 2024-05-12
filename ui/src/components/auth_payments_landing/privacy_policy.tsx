import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import HeaderMobile from "./header_mobile";

const PrivacyPolicy: Component = () => {
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
        <main class="flex flex-col gap-4">
          <div class="text-3xl font-bold text-center">Privacy Policy</div>
          <div class="text-center">Last Updated: April 13, 2024</div>
          <div>
            <div>
              This Privacy Policy outlines the types of personal information
              collected, used, and protected by I Lov Guitars Inc., doing
              business as Commonly Odd ("Company", "we", "us", or "our"). Our
              website, located at https://www.commonlyodd.com, is committed to
              maintaining the privacy and security of our users' information.
              Please read this policy carefully to understand our practices
              regarding your personal information and how we will treat it.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Information We Collect</div>
            <div class="font-semibold pb-2">
              Personal Information You Provide
            </div>
            <ul class="list-disc ml-8">
              <li>
                Account Information: When you create an account with us, we
                collect your name, profile picture, username, and password.
              </li>
              <li>
                Social Logins: If you choose to log in via social media
                platforms such as Facebook or Google, we may collect information
                provided by these services such as your email address and public
                profile information.
              </li>
            </ul>
            <div class="font-semibold pt-4 pb-2">
              Information Collected Automatically
            </div>
            <ul class="list-disc ml-8">
              <li>
                Log and Usage Data: Details of your use of our service
                including, but not limited to, traffic data, location data, and
                other communication data and the resources that you access.
              </li>
              <li>
                Device Information: We collect information about the device you
                use to access our services, including hardware model, operating
                system, and unique device identifiers.
              </li>
              <li>
                Location Information: We may collect information about your
                actual location which can be derived from your IP address.
              </li>
            </ul>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">
              How We Use Your Information
            </div>
            <div>
              We use your information to provide and manage your account,
              improve our services, communicate with you about service-related
              issues, and, with your consent, send you promotional messages and
              marketing. We also use your information to comply with legal
              obligations and enforce our terms.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Third-Party Services</div>
            <div>
              We use third-party services such as Stripe for payment processing
              and various analytics and tracking tools to understand service
              usage. Each third-party partner has its own privacy policies,
              which we encourage you to review.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">
              Cookies and Tracking Technologies
            </div>
            <div>
              We use cookies and similar tracking technologies to track activity
              on our services and hold certain information, helping to enhance
              your user experience.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Data Retention</div>
            <div>
              We retain personal information as long as it is necessary to
              fulfill the purposes outlined in this privacy policy and as long
              as your account is active. Once you delete your account, we delete
              your personal information, except for your name, email, and
              profile picture.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Your Data Rights</div>
            <div>
              You have the right to access, update, or delete the information we
              have on you at any time through your account settings.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Children's Privacy</div>
            <div>
              We do not knowingly collect or solicit any information from anyone
              under the age of 13. If you are under 13, please do not attempt to
              register for the services or send any personal information about
              yourself to us.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">
              Changes to This Privacy Policy
            </div>
            <div>
              We may update this Privacy Policy to reflect changes to our
              information practices. If we make any material changes, we will
              notify you by email (e-mail address used to log in) or by means of
              a notice on this site prior to the change becoming effective.
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold py-2">Contact Us</div>
            <div>
              If you have any questions about this Privacy Policy, please
              contact us via email at bruce@commonlyodd.com or visit our contact
              page. Our mailing address is: I Lov Guitars Inc., 1102-2250
              Kennedy Road, Scarborough, Ontario, M1T 3G7, Canada
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
