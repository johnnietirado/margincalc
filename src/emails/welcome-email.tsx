import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
interface WelcomeEmailProps {
  username?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  username = "valued customer",
}) => (
  <Html>
    <Head />
    <Preview>Welcome to Our SaaS Platform - Get Started Now!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#000",
            },
          },
        },
      }}
    >
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 px-4 max-w-xl">
          <Img
            src={`/placeholder-logo.png`}
            width="170"
            height="50"
            alt="Your SaaS Logo"
            className="mx-auto mb-5"
          />
          <Heading className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Welcome to Our SaaS Platform, {username}!
          </Heading>
          <Text className="text-gray-700 mb-6">
            We&apos;re thrilled to have you on board. Our platform is designed
            to help you [brief description of main benefit]. Let&apos;s get you
            started on your journey to success!
          </Text>

          <Section className="text-center mb-8">
            <Button
              className="bg-slate-950 text-white text-lg font-semibold no-underline text-center p-4 py-2"
              href="https://your-saas-platform.com/get-started"
            >
              Get Started Now
            </Button>
          </Section>

          <Heading
            as="h2"
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Quick Start Guide:
          </Heading>
          <Text className="text-gray-700 mb-6">
            1. Log in to your account at{" "}
            <Link
              href="https://your-saas-platform.com/login"
              className="text-blue-600"
              style={{ textDecoration: "underline" }}
            >
              your-saas-platform.com
            </Link>
            <br />
            2. Complete your profile setup
            <br />
            3. Explore our interactive tutorial
            <br />
            4. Set up your first project
          </Text>

          <Heading
            as="h2"
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Key Features:
          </Heading>
          <Text className="text-gray-700 mb-6">
            • Feature 1: Brief description
            <br />
            • Feature 2: Brief description
            <br />• Feature 3: Brief description
          </Text>

          <Heading
            as="h2"
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Need Help?
          </Heading>
          <Text className="text-gray-700 mb-2">
            Our support team is always here to assist you:
          </Text>
          <Text className="text-gray-700 mb-6">
            • Visit our{" "}
            <Link
              href="https://your-saas-platform.com/help"
              className="text-blue-600"
              style={{ textDecoration: "underline" }}
            >
              Help Center
            </Link>
            <br />• Email us at{" "}
            <Link
              href="mailto:support@your-saas-platform.com"
              className="text-blue-600"
              style={{ textDecoration: "underline" }}
            >
              support@your-saas-platform.com
            </Link>
            <br />• Chat with us directly through the platform
          </Text>

          <Hr className="border-gray-300 my-6" />

          <Text className="text-gray-600 text-sm mb-4">
            Follow us on social media for tips, updates, and community
            highlights:
          </Text>
          <Section className="mb-6">
            <Link
              href="https://twitter.com/your-saas"
              className="text-blue-600 underline mr-4"
            >
              Twitter
            </Link>
            <Link
              href="https://facebook.com/your-saas"
              className="text-blue-600 underline mr-4"
            >
              Facebook
            </Link>
            <Link
              href="https://linkedin.com/company/your-saas"
              className="text-blue-600 underline"
            >
              LinkedIn
            </Link>
          </Section>

          <Text className="text-gray-600 text-sm text-center">
            © 2023 Your SaaS Platform. All rights reserved.
            <br />
            123 SaaS Street, Tech City, TC 12345
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WelcomeEmail;
