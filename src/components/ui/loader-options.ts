export const transparentBackgroundLoaderCount = 13;
export const loaderCount = transparentBackgroundLoaderCount + 2;

export function getRandomLoaderIndex(previousIndex?: number) {
  if (loaderCount <= 1) return 0;

  let nextIndex = Math.floor(Math.random() * loaderCount);
  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * loaderCount);
  }

  return nextIndex;
}
