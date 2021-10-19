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
import { useToast } from "@chakra-ui/toast";
import { POST } from "../components/utils/helper";
import { IData } from "../components/types";

const Home: NextPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IData>();
  const [longUrl, setLongUrl] = useState<string>("");
  const { hasCopied, onCopy } = useClipboard("sda");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");

  const btnColor = useColorModeValue("blue", "green");

  const handleChange = (e: React.FormEvent<EventTarget>) => {
    setData({});
    let target = e.target as HTMLInputElement;
    setLongUrl(target.value);
  };

  const getShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      return toast({
        title: "Please enter a Url",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(true);

    let response = await POST(
      "https://aqueous-wave-62564.herokuapp.com/api/shorten",
      { longUrl }
    );
    if (response && !response.error) {
      setData(response?.data);
    } else {
      toast({
        title: response?.error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
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
                <FormLabel id="longUrl" htmlFor="longUrl">
                  Enter the long url you want to shorten
                </FormLabel>
                <Input
                  value={longUrl}
                  onChange={handleChange}
                  variant="flushed"
                  id="longurl"
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

            {data?.shortUrl && longUrl && (
              <VStack w="full">
                <Heading size="xl">Ready!</Heading>
                <VStack w="full">
                  <FormLabel>Your shortened url is: </FormLabel>

                  <Flex w="full" my={5}>
                    <Input
                      isReadOnly
                      value={data.shortUrl}
                      variant="filled"
                      placeholder="yes.com/1"
                      id="shortened-url"
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
