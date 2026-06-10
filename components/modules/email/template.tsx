import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
  } from "react-email";

  
  interface WaitlistEmailProps {
    userFirstname: string;
  }
  
  export const WaitlistEmail = ({
    userFirstname,
  }: WaitlistEmailProps) => (
    <Html>
      <Head />
      <Preview>
        🚀 You're on the NotYetLaunched waitlist
      </Preview>
  
      <Body style={main}>
        <Container style={container}>
          <Section style={badgeContainer}>
            <Text style={badge}>🚀 Early Access Waitlist</Text>
          </Section>
  
          <Img
            src="https://www.notyetlaunched.xyz/notyetlaunchedlogo.svg"
            width="180"
            alt="NotYetLaunched"
            style={logo}
          />
  
          <Text style={greeting}>
            Hi {userFirstname},
          </Text>
  
          <Text style={paragraph}>
            Thanks for joining the <strong>NotYetLaunched</strong> waitlist.
          </Text>
  
          <Text style={paragraph}>
            You're officially among the first creators getting
            access to a platform designed to help content creators
            manage the business side of creating.
          </Text>
  
          <Section style={featureCard}>
            <Text style={featureTitle}>
              What is NotYetLaunched?
            </Text>
  
            <Text style={featureText}>
              NotYetLaunched helps creators:
            </Text>
  
            <Text style={list}>
              • Track brand deals & sponsorships
              <br />
              • Monitor invoices & payments
              <br />
              • Manage campaign deadlines
              <br />
              • Organize creator partnerships
              <br />
              • Generate professional media kits
              <br />
              • Analyze YouTube & Instagram performance
            </Text>
          </Section>
  
          <Text style={paragraph}>
            No more scattered spreadsheets, forgotten follow-ups,
            or missed payment deadlines.
          </Text>
  
          <Section style={featureCard}>
            <Text style={featureTitle}>
              What's Next?
            </Text>
  
            <Text style={list}>
              ✓ Early access before public launch
              <br />
              ✓ Product updates and sneak peeks
              <br />
              ✓ Opportunities to shape the product
              <br />
              ✓ Founding user perks & special pricing
            </Text>
          </Section>
  
          <Text style={paragraph}>
            We're building NotYetLaunched alongside creators.
          </Text>
  
          <Text style={paragraph}>
            What's the most frustrating part of managing brand
            deals today?
          </Text>
  
          <Text style={paragraph}>
            Simply reply to this email and let us know. Every
            response helps us build a better product.
          </Text>
  
          <Text style={signOff}>
            Thanks for being here from the beginning.
            <br />
            <br />
            — Mridul Pandey
            <br />
            Founder, NotYetLaunched
          </Text>
  
          <Hr style={hr} />
  
          <Text style={footer}>
            You received this email because you joined the
            NotYetLaunched waitlist.
            <br />
            If this wasn't you, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  WaitlistEmail.PreviewProps = {
    userFirstname: "Creator",
  } as WaitlistEmailProps;
  
  export default WaitlistEmail;
  
  const main = {
    backgroundColor: "#000000",
    background:
      "radial-gradient(circle at top, rgba(0,122,92,0.25) 0%, #000000 60%)",
    fontFamily:
      "Inter, Figtree, Helvetica Neue, Helvetica, Arial, sans-serif",
    padding: "40px 20px",
  };
  
  const container = {
    maxWidth: "620px",
    margin: "0 auto",
    backgroundColor: "#0A0A0A",
    border: "1px solid #1F1F1F",
    borderRadius: "20px",
    padding: "40px",
  };
  
  const badgeContainer = {
    textAlign: "center" as const,
    marginBottom: "20px",
  };
  
  const badge = {
    display: "inline-block",
    backgroundColor: "rgba(0,122,92,0.15)",
    color: "#00A67E",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    margin: "0 auto",
  };
  
  const logo = {
    margin: "0 auto 32px",
  };
  
  const greeting = {
    fontSize: "18px",
    color: "#FFFFFF",
    marginBottom: "24px",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "28px",
    color: "#D4D4D8",
    marginBottom: "20px",
  };
  
  const featureCard = {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "14px",
    padding: "24px",
    margin: "28px 0",
  };
  
  const featureTitle = {
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
  };
  
  const featureText = {
    color: "#D4D4D8",
    fontSize: "15px",
  };
  
  const list = {
    color: "#A1A1AA",
    fontSize: "15px",
    lineHeight: "28px",
  };
  
  const signOff = {
    color: "#FFFFFF",
    fontSize: "16px",
    lineHeight: "28px",
    marginTop: "30px",
  };
  
  const hr = {
    borderColor: "#222222",
    margin: "32px 0",
  };
  
  const footer = {
    color: "#71717A",
    fontSize: "12px",
    lineHeight: "20px",
    textAlign: "center" as const,
  };