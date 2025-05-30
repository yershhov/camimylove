import { Center, Image } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
const loaders = [
  "https://media.tenor.com/aMOxt0o16TQAAAAi/bubu-bubu-dudu.gif",
  "https://media.tenor.com/PXKZhCEfEfsAAAAi/bubu-bubu-dudu.gif",
  "https://media.tenor.com/r0VCmLiA3mEAAAAi/sseeyall-bubu-dudu.gif",
  "https://media.tenor.com/T8fPoraSgscAAAAi/bubu-dudu-sseeyall.gif",
  "https://media.tenor.com/PLQ-msOeeLUAAAAi/dudu-on-top-bubu-hearts.giff",
];
const Loader = memo(({ animate }: { animate?: boolean }) => {
  const [src] = useState(loaders[Math.floor(Math.random() * loaders.length)]);

  const [animateFinished, setAnimateFinished] = useState(false);

  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        setAnimateFinished(true);
      }, 3000);
    }
  }, [animate]);

  return (
    <Center
      h="300px"
      aspectRatio={1}
      data-state={animate ? (animateFinished ? "closed" : "open") : ""}
      _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "1500ms",
      }}
      _closed={{
        animationName: "fade-out",
        animationDuration: "1500ms",
        animationFillMode: "forwards",
      }}
    >
      <Image src={src} />
    </Center>
  );
});

export default Loader;
