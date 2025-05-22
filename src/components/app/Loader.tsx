import { Center, Image } from "@chakra-ui/react";

const Loader = () => {
  const loaders = [
    "https://media.tenor.com/aMOxt0o16TQAAAAi/bubu-bubu-dudu.gif",
    "https://media.tenor.com/PXKZhCEfEfsAAAAi/bubu-bubu-dudu.gif",
    "https://media.tenor.com/r0VCmLiA3mEAAAAi/sseeyall-bubu-dudu.gif",
    "https://media.tenor.com/T8fPoraSgscAAAAi/bubu-dudu-sseeyall.gif",
    "https://media.tenor.com/PLQ-msOeeLUAAAAi/dudu-on-top-bubu-hearts.giff",
  ];

  return (
    <Center h="300px" aspectRatio={1}>
      <Image
        src={loaders[Math.floor(Math.random() * loaders.length)]}
        // objectFit={"contain"}
      />
    </Center>
  );
};

export default Loader;
