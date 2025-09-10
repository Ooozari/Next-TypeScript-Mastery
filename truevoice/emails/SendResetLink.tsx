import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface SendResetLinkProps {
  email: string;
  resetUrl: string;
}

export default function SendResetLink({ email, resetUrl }: SendResetLinkProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          body {
            background: linear-gradient(to bottom, #111827, #115e59);
            color: #d1d5db;
            padding: 20px;
            font-family: 'Roboto', Verdana, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(94, 234, 212, 0.5);
            border-radius: 12px;
            padding: 24px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          .button {
            background: linear-gradient(to right, #14b8a6, #06b6d4);
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-weight: 500;
            text-align: center;
          }
          .button:hover {
            background: linear-gradient(to right, #0d9488, #0891b2);
          }
        `}</style>
      </Head>
      <Preview>Reset your True Voice password</Preview>
      <Section className="container">
        <Row>
          <Heading
            as="h2"
            style={{ color: "#f0fdfa", fontWeight: "800", textAlign: "center" }}
          >
            Hello, {email}
          </Heading>
        </Row>
        <Row>
          <Text
            style={{ color: "#d1d5db", lineHeight: "1.5", textAlign: "center" }}
          >
            You requested a password reset for your True Voice account. Click
            the button below to reset your password:
          </Text>
        </Row>
        <Row>
          <Text style={{ textAlign: "center", margin: "24px 0" }}>
            <Button
              href={resetUrl}
              style={{
                background: "linear-gradient(to right, #14b8a6, #06b6d4)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                textAlign: "center",
                display: "inline-block",
              }}
            >
              Reset Your Password
            </Button>
          </Text>
        </Row>
        <Row>
          <Text
            style={{ color: "#d1d5db", lineHeight: "1.5", textAlign: "center" }}
          >
            If you did not request a password reset, please ignore this email or
            contact support.
          </Text>
        </Row>
        <Row>
          <Text
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            &copy; 2025 True Voice. All rights reserved.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
