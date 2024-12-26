const faqs = [
  {
    id: 1,
    question: "What is the main benefit of using your SaaS platform?",
    answer:
      "Our SaaS platform streamlines your workflow, increases productivity, and provides real-time analytics, allowing you to make data-driven decisions faster and more efficiently.",
  },
  {
    id: 2,
    question: "How secure is my data on your platform?",
    answer:
      "We take security seriously. We use industry-standard encryption, regular security audits, and comply with GDPR and other data protection regulations to ensure your data is always safe and secure.",
  },
  {
    id: 3,
    question: "Can I integrate your platform with other tools we're using?",
    answer:
      "Yes, our platform offers a wide range of integrations with popular tools and services. We also provide API access for custom integrations to fit your specific needs.",
  },
  {
    id: 4,
    question: "What kind of customer support do you offer?",
    answer:
      "We offer 24/7 customer support via email, live chat, and phone. Our dedicated support team is always ready to assist you with any questions or issues you may encounter.",
  },
  {
    id: 5,
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial for all our plans. This allows you to explore all features and determine which plan best suits your needs before committing.",
  },
  {
    id: 6,
    question: "How often do you release updates and new features?",
    answer:
      "We have a regular update cycle, typically releasing new features and improvements every month. We also consider customer feedback for prioritizing new features.",
  },
  {
    id: 7,
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences.",
  },
  {
    id: 8,
    question: "Do you offer custom solutions for enterprise clients?",
    answer:
      "Yes, we offer tailored enterprise solutions. Our team can work with you to customize our platform to meet your specific requirements and scale according to your needs.",
  },
  {
    id: 9,
    question: "What happens to my data if I decide to cancel my subscription?",
    answer:
      "Upon cancellation, you'll have 30 days to export your data. After this period, we securely delete all your data from our servers to protect your privacy.",
  },
  {
    id: 10,
    question: "Is training provided for new users?",
    answer:
      "Yes, we provide comprehensive onboarding and training resources, including video tutorials, documentation, and webinars. For enterprise clients, we also offer personalized training sessions.",
  },
];

export default function FAQSection() {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
      <h2 className="text-2xl font-bold leading-10 tracking-tight text-primary">
        Frequently asked questions
      </h2>
      <dl className="mt-10 space-y-8 divide-y divide-gray-900/10 dark:divide-gray-100/10">
        {faqs.map((faq) => (
          <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 lg:col-span-5">
              {faq.question}
            </dt>
            <dd className="mt-4 lg:col-span-7 lg:mt-0">
              <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
