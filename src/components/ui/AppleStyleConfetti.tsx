import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useToken } from "@chakra-ui/react";

const AppleStyleConfetti = () => {
  const canvasRef = useRef(null);

  const [green, blue, yellow, red] = useToken("colors", [
    "green.500",
    "blue.500",
    "yellow.500",
    "red.500",
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 150,
      startVelocity: 60,
      spread: 120,
      origin: { y: 0, x: 0.5 },
      gravity: 1.1,
      ticks: 200,
      colors: [green, blue, yellow, red],
      shapes: ["square", "circle"],
    });

    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 4,
        startVelocity: 10,
        spread: 360,
        ticks: 240,
        origin: { x: Math.random(), y: 0 },
        gravity: 0.8,
        scalar: 1,
        colors: [green, blue, yellow, red],
        shapes: ["square", "circle"],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      myConfetti.reset();
    };
  }, [blue, green, red, yellow]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 9999,
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default AppleStyleConfetti;
