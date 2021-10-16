import { Button } from "@chakra-ui/button";
import { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useClipboard } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import {
  Container,
  Flex,
  VStack,
  Text,
  Center,
  Heading,
  Link,
} from "@chakra-ui/layout";

import type { NextPage } from "next";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@chakra-ui/toast";

interface ShortUrl {
  longUrl: string;
  shortUrl: string;
  shortCode: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
const Home: NextPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [longUrl, setLongUrl] = useState("");
  const { hasCopied, onCopy } = useClipboard(value);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");

  const btnColor = useColorModeValue("blue", "green");

  const handleChange = (e: React.FormEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement;
    setLongUrl(target.value);
  };

  const getShortLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!longUrl) {
      return toast({
        title: "Invalid",
        description: "Long Url cannot be blank",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(true);
    try {
      let response: AxiosResponse<ShortUrl> = await axios.post<ShortUrl>(
        "https://aqueous-wave-62564.herokuapp.com/api/shorten",
        { longUrl }
      );

      if (response && response.data) {
        let { shortUrl } = response.data;
        setValue(shortUrl);
      }
    } catch (error) {
      toast({
        title: "Check and try again.",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Container p={0} maxW="container.xl" bgColor={bgColor}>
      <Flex h="100vh" justify="center" align="center">
        <Center>
          <VStack w="full" h="full" p={5} spacing={5}>
            <Heading size="2xl">Get your shortened url link.</Heading>
            <Text>
              prefer {colorMode === "light" ? "dark" : "light"} mode?{"   "}
              <Link onClick={toggleColorMode} color={btnColor}>
                Click here
              </Link>
            </Text>

            <VStack w="full">
              <FormControl isRequired>
                <FormLabel>Enter the long url you want to shorten</FormLabel>
                <Input
                  value={longUrl}
                  onChange={handleChange}
                  variant="flushed"
                  placeholder="e.g https://github.com/Sambalicious/shorten-url"
                />
                <Button
                  onClick={getShortLink}
                  type="submit"
                  colorScheme={btnColor}
                  my={5}
                  w="full"
                  isLoading={loading}
                  loadingText="getting short url..."
                >
                  Submit
                </Button>
              </FormControl>
            </VStack>

            {value && (
              <VStack w="full">
                <Heading size="xl">Ready!</Heading>
                <VStack w="full">
                  <FormLabel>Your shortened url is: </FormLabel>

                  <Flex w="full" my={5}>
                    <Input
                      isReadOnly
                      value={value}
                      variant="filled"
                      placeholder="yes.com/1"
                    />
                    <Button colorScheme={btnColor} onClick={onCopy} ml={2}>
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </Flex>
                </VStack>
              </VStack>
            )}
          </VStack>
        </Center>
      </Flex>
    </Container>
  );
};

export default Home;
