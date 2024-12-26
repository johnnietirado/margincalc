import { ContactForm } from "@/components/contact-form";

export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-center text-2xl font-bold">Contact Us</h1>
      <p className="my-8 leading-7 [&:not(:first-child)]:mt-8">
        This is a simple contact form that will send an email to the owner of
        the website. Make sure to update FROM_EMAIL environment variable to your
        own email. Also you can change the email that is sent{" "}
        <span className="rounded-md bg-gray-200 px-1 py-0.5 font-mono dark:bg-gray-800">
          packages/emails
        </span>{" "}
        folder.
      </p>
      <p className="my-8 leading-7 [&:not(:first-child)]:mt-8">
        This form uses <strong>tRPC</strong> to send the email.
      </p>
      <ContactForm />
    </div>
  );
}
