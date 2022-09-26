import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"} letterSpacing="wider">
      <Container as="section" maxW="8xl">
        <Box as="nav" py="4">
          <Flex justify="space-between" alignItems={"center"} h="8">
            <Text fontSize="2xl" fontWeight={"bold"}>
              MerkleNFTBriege
            </Text>
            <HStack>
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container flex={1} maxW="8xl">
        {children}
      </Container>
    </Flex>
  );
};
