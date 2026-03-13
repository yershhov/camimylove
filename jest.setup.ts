import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

Object.defineProperty(globalThis, "TextEncoder", {
  writable: true,
  value: TextEncoder,
});

Object.defineProperty(globalThis, "TextDecoder", {
  writable: true,
  value: TextDecoder,
});

Object.defineProperty(globalThis, "structuredClone", {
  writable: true,
  value: <T>(value: T) =>
    value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => undefined,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(globalThis.URL, "createObjectURL", {
  writable: true,
  value: () => "blob:mock-preview",
});

Object.defineProperty(globalThis.URL, "revokeObjectURL", {
  writable: true,
  value: () => undefined,
});

Object.defineProperty(globalThis, "requestAnimationFrame", {
  writable: true,
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
});

Object.defineProperty(globalThis, "cancelAnimationFrame", {
  writable: true,
  value: (id: number) => clearTimeout(id),
});
