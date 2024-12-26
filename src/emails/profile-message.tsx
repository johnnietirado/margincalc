import { Body, Container, Head, Html, Text } from "@react-email/components";

interface ProfileMessageEmailProps {
  message: string;
}

const ProfileMessageEmail: React.FC<ProfileMessageEmailProps> = ({
  message,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={text}>{message}</Text>
      </Container>
    </Body>
  </Html>
);

export default ProfileMessageEmail;

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
