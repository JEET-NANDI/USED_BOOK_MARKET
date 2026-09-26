import { useEffect } from "react";
import "./HoliCursor.css";

export default function HoliCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) return;

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastPoint = 0;

    function makeGoldenPoint(x, y) {
      const point = document.createElement("span");

      const size = 3 + Math.random() * 5;

      const offsetX =
        (Math.random() - 0.5) * 16;

      const offsetY =
        (Math.random() - 0.5) * 16;

      point.className = "gold-cursor-point";

      point.style.left = `${x + offsetX}px`;
      point.style.top = `${y + offsetY}px`;

      point.style.width = `${size}px`;
      point.style.height = `${size}px`;

      point.style.setProperty(
        "--point-x",
        `${(Math.random() - 0.5) * 20}px`
      );

      point.style.setProperty(
        "--point-y",
        `${(Math.random() - 0.5) * 20}px`
      );

      document.body.appendChild(point);

      window.setTimeout(() => {
        point.remove();
      }, 650);
    }

    function handlePointerMove(event) {
      const {
        clientX: x,
        clientY: y,
      } = event;

      const dx = x - lastX;
      const dy = y - lastY;

      const distance = Math.hypot(dx, dy);

      if (distance > 1) {
        const now = performance.now();

        if (now - lastPoint > 28) {
          makeGoldenPoint(x, y);
          lastPoint = now;
        }
      }

      lastX = x;
      lastY = y;
    }

    function handlePointerLeave() {
      lastX = window.innerWidth / 2;
      lastY = window.innerHeight / 2;
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      document
        .querySelectorAll(".gold-cursor-point")
        .forEach((point) => point.remove());
    };
  }, []);

  return null;
}