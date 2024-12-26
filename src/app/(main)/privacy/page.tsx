import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for our service",
};

export default function PrivacyPolicy() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p className="leading-relaxed">
            This privacy policy explains how we collect, use, and protect your
            information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            2. Information We Collect
          </h2>
          <p className="leading-relaxed">
            We may collect personal information such as your name, email
            address, and usage data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            3. How We Use Your Information
          </h2>
          <p className="leading-relaxed">
            We use your information to provide and improve our services,
            communicate with you, and comply with legal obligations.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
          <p className="leading-relaxed">
            We implement appropriate security measures to protect your
            information from unauthorized access.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            5. Changes to This Policy
          </h2>
          <p className="leading-relaxed">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
