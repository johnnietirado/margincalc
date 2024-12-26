import { Body, Container, Head, Html, Text } from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  name,
  email,
  message,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={text}>New contact form submission</Text>
        <Text style={text}>
          <strong>Name:</strong> {name}
        </Text>
        <Text style={text}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={text}>
          <strong>Message:</strong> {message}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ContactFormEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  padding: "20px",
};

const text = {
  color: "#333",
  fontSize: "16px",
};
