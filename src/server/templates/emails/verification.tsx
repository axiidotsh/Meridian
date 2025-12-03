import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  userName,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>Verify your email address to get started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={heading}>Welcome aboard!</Heading>

            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              Thank you for signing up. To complete your registration and start
              using your account, please verify your email address.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={expiry}>This link will expire in 24 hours.</Text>

            <Hr style={divider} />

            <Text style={alternativeText}>
              If the button above doesn&apos;t work, copy and paste this link
              into your browser:
            </Text>

            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t create this account, please disregard this
              email.
            </Text>
            <Text style={footerText}>No further action is required.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const content = {
  padding: '48px 40px',
};

const heading = {
  color: '#18181b',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '36px',
  margin: '0 0 24px',
  padding: '0',
};

const greeting = {
  color: '#18181b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const paragraph = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 32px',
};

const buttonContainer = {
  margin: '0 0 32px',
};

const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '20px',
};

const expiry = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 32px',
};

const divider = {
  borderColor: '#e4e4e7',
  margin: '32px 0',
};

const alternativeText = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const link = {
  color: '#3b82f6',
  fontSize: '13px',
  lineHeight: '20px',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
  display: 'block',
};

const footer = {
  backgroundColor: '#fafafa',
  padding: '32px 40px',
  borderTop: '1px solid #e4e4e7',
};

const footerText = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};
