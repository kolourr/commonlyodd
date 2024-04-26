import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";

const TermsOfUse: Component = () => {
  return (
    <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
      <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
        <Header />
        <main class="flex flex-col gap-4">
          <h1 class="text-3xl font-bold flex justify-center items-center">
            Terms of Use
          </h1>
          <p class="flex justify-center items-center">
            Last Updated: April 13, 2024
          </p>
          <section>
            <p>
              Welcome to Commonly Odd, a trivia-based gaming service provided by
              I Lov Guitars Inc. ("Company", "we", "us", or "our"). Located at
              https://www.commonlyodd.com, our platform offers a distinctive and
              interactive trivia experience tailored for diverse interests.
              Please read these Terms of Use ("Terms") thoroughly before
              engaging with our services.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Acceptance of Terms</h2>
            <p>
              By accessing or engaging with our services, you acknowledge and
              agree to these legally binding Terms and our Privacy Policy,
              accessible at https://www.commonlyodd.com/privacy-policy. These
              documents govern the collection and use of personal data you
              provide. If these Terms are not acceptable to you, refrain from
              using our services.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Registration and Accounts</h2>
            <p>
              To fully access our services, you must register and create an
              account. Provide accurate and current information during signup.
              You are responsible for safeguarding your login credentials and
              must notify us at commonlyoddtrivia@gmail.com immediately if you
              suspect any unauthorized use of your account.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Subscription and Payments</h2>
            <p>
              Upon registration, you will receive a 7-day free trial. Unless
              canceled, this trial will automatically convert to a paid
              subscription—monthly or yearly based on your choice during
              registration. All payment processing is securely managed via
              Stripe.com. We do not retain sensitive payment data. Subscriptions
              renew automatically unless canceled prior to the renewal date.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">User Data</h2>
            <p>
              We collect and use data from you to enhance the performance and
              functionality of our services. By using our services, you consent
              to the collection, use, and disclosure of your information as
              outlined in our Privacy Policy.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">
              Intellectual Property Rights
            </h2>
            <p>
              You may not copy, reproduce, redistribute, or exploit any part of
              our service, its content, or any related software. All rights not
              expressly granted to you are retained by the Company.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">No Refunds</h2>
            <p>
              All payments made to Commonly Odd are final and non-refundable.
              Subscription cancellations can be processed any time through your
              account settings, but no refunds will be issued for any remaining
              subscription period.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">User Conduct</h2>
            <p>
              Your use of our services is subject to all applicable laws and
              regulations. Engaging in or promoting illegal activities,
              harassing, threatening, or defrauding other users, and
              distributing malicious software or harmful data are prohibited.
              Violations may result in immediate termination of your account and
              legal action if necessary.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Disclaimer</h2>
            <p>
              Our services are provided "as is" and "as available" without any
              warranties, express or implied, including but not limited to the
              implied warranties of merchantability, fitness for a particular
              purpose, or non-infringement. We do not guarantee that the
              services will always be secure, error-free, or timely; nor do we
              guarantee the accuracy or reliability of any information obtained
              through the services.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Limitations of Liability</h2>
            <p>
              In no event will the Company, its affiliates, employees,
              licensors, or service providers be liable for any indirect,
              consequential, exemplary, incidental, special, or punitive
              damages, including lost profits, even if we have been advised of
              the possibility of such damages. Notwithstanding any damages that
              you might incur, our entire liability under any provision of these
              Terms and your exclusive remedy for all of the foregoing shall be
              limited to the amount actually paid by you through the service
              during the six months preceding the date on which the claim arose.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless I Lov Guitars Inc., its
              directors, employees, partners, agents, suppliers, and affiliates
              from any and all third-party claims, damages, obligations, losses,
              liabilities, costs, or debt, and expenses arising from your use of
              and access to the service, your violation of these Terms, or your
              violation of any rights of another.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Miscellaneous</h2>
            <p>
              These Terms constitute the entire agreement between you and
              Commonly Odd regarding your use of the services. If any part of
              these Terms is deemed unenforceable, the remainder will continue
              in effect.
            </p>
          </section>
          <section>
            <h2 class="text-2xl font-bold py-2">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us via
              email at commonlyoddtrivia@gmail.com or at our mailing address:
            </p>
            <address>
              I Lov Guitars Inc. 1102-2250 Kennedy Road Scarborough, Ontario M1T
              3G7 Canada
            </address>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
