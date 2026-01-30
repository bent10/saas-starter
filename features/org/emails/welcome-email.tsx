import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  dashboardLink: string;
}

export const WelcomeEmail = ({
  name = 'User',
  dashboardLink = 'https://example.com/dashboard',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SaaS Starter</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to SaaS Starter!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hi {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thanks for getting started with our platform. We're excited to have you on board.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={dashboardLink}
              >
                Go to Dashboard
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
