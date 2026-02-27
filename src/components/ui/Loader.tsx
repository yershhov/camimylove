import { Center, Image } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";

const transparentBackgroundLoaders = [
  "https://media.tenor.com/aMOxt0o16TQAAAAi/bubu-bubu-dudu.gif",
  "https://media.tenor.com/PXKZhCEfEfsAAAAi/bubu-bubu-dudu.gif",
  "https://media.tenor.com/r0VCmLiA3mEAAAAi/sseeyall-bubu-dudu.gif",
  "https://media.tenor.com/T8fPoraSgscAAAAi/bubu-dudu-sseeyall.gif",
  "https://media.tenor.com/PLQ-msOeeLUAAAAi/dudu-on-top-bubu-hearts.gif",
  "https://media.tenor.com/16JLRwPfDfAAAAAj/dudu-bubu-dancing-so-cute.gif",
  "https://media.tenor.com/I_rw0vcOXJYAAAAi/dudu-bubu-cute-kiss.gif",
  "https://media.tenor.com/uRyi-tc_AdAAAAAi/bubu-dudu.gif",
  "https://media.tenor.com/lqkhyQhifNcAAAAi/jump-bubu-dudu.gif",
  "https://media.tenor.com/wKP-p_HtfOoAAAAi/bubu-dudu.gif",
  "https://media.tenor.com/F9Q3thp6tzUAAAAj/bubu-bubu-dudu.gif",
  "https://media.tenor.com/4bV9ylEOWpgAAAAi/bubu-dudu-sseeyall.gif",
  "https://media.tenor.com/DBImicQnTG0AAAAi/bubu-dudu-eat.gif",
];

const loaders = [
  ...transparentBackgroundLoaders,
  "https://media1.tenor.com/m/ZgEwD09MywgAAAAC/dudu-kissing-bubu-hearts.gif",
  "https://media1.tenor.com/m/FfkBxAXCo1cAAAAC/bubu.gif",
];

let recentLoaders: number[] = [];

const LIMIT = 6;

function getRandomIndex(animate?: boolean) {
  const considerableLoaders = animate ? transparentBackgroundLoaders : loaders;

  const availableIndexes = considerableLoaders
    .map((_, idx) => idx)
    .filter((idx) => !recentLoaders.includes(idx));

  const pickFrom =
    availableIndexes.length > 0
      ? availableIndexes
      : considerableLoaders.map((_, idx) => idx);

  const idx = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  recentLoaders.push(idx);
  if (recentLoaders.length > LIMIT) recentLoaders.shift();
  // console.log(recentLoaders);
  return idx;
}

type LoaderProps = {
  animate?: boolean;
  fitContainer?: boolean;
};

const Loader = memo(({ animate, fitContainer }: LoaderProps) => {
  const [src] = useState(() => loaders[getRandomIndex(animate)]);

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
      h={fitContainer ? "100%" : "300px"}
      w={fitContainer ? "100%" : undefined}
      aspectRatio={fitContainer ? undefined : 1}
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
      <Image
        src={src}
        maxH={fitContainer ? "75%" : undefined}
        maxW={fitContainer ? "75%" : undefined}
        objectFit="contain"
      />
    </Center>
  );
});

export default Loader;
