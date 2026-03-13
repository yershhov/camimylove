import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

type AppToastOptions = Parameters<typeof toaster.create>[0];

export const createAppToast = (options: AppToastOptions) => {
  return toaster.create({
    ...options,
    duration: 2000,
  });
};
