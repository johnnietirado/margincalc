import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for our service",
};

export default function TermsAndConditions() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement. If you do not
            agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">2. Use License</h2>
          <p className="leading-relaxed">
            Permission is granted to temporarily download one copy of the
            materials (information or software) on our website for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">3. Disclaimer</h2>
          <p className="leading-relaxed">
            The materials on our website are provided on an &apos;as is&apos;
            basis. We make no warranties, expressed or implied, and hereby
            disclaim and negate all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">4. Limitations</h2>
          <p className="leading-relaxed">
            In no event shall we or our suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability
            to use the materials on our website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            5. Revisions and Errata
          </h2>
          <p className="leading-relaxed">
            The materials appearing on our website could include technical,
            typographical, or photographic errors. We do not warrant that any of
            the materials on its website are accurate, complete or current. We
            may make changes to the materials contained on its website at any
            time without notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">6. Links</h2>
          <p className="leading-relaxed">
            We have not reviewed all of the sites linked to its website and is
            not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by us of the site.
            Use of any such linked website is at the user&apos;s own risk.
          </p>
        </section>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            If you have any questions about these Terms and Conditions, please
            contact us at{" "}
            <a
              href="mailto:legal@example.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              legal@example.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
