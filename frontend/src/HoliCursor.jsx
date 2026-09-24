import { useEffect } from "react";
import "./HoliCursor.css";

const COLORS = ["#ff3987", "#ff8a24", "#ffd735", "#3aa9ff", "#62c950", "#9a5bff"];

export default function HoliCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) return;

    const cursor = document.querySelector(".holi-cursor");
    if (!cursor) return;

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastSplash = 0;

    function makeSplash(x, y) {
      const splash = document.createElement("span");
      const size = 7 + Math.random() * 14;

      splash.className = "holi-splash";
      splash.style.left = `${x + (Math.random() - 0.5) * 22}px`;
      splash.style.top = `${y + (Math.random() - 0.5) * 22}px`;
      splash.style.width = `${size}px`;
      splash.style.height = `${size}px`;
      splash.style.backgroundColor =
        COLORS[Math.floor(Math.random() * COLORS.length)];

      document.body.appendChild(splash);
      window.setTimeout(() => splash.remove(), 750);
    }

    function handlePointerMove(event) {
      const { clientX: x, clientY: y } = event;
      const dx = x - lastX;
      const dy = y - lastY;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.classList.add("is-visible");
      document.body.classList.add("holi-cursor-active");

      if (Math.hypot(dx, dy) > 1) {
        // Rotate the arrow to point in the direction of movement.
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        cursor.style.setProperty("--angle", `${angle}deg`);

        const now = performance.now();
        if (now - lastSplash > 45) {
          makeSplash(x, y);
          lastSplash = now;
        }
      }

      lastX = x;
      lastY = y;
    }

    function handlePointerLeave() {
      cursor.classList.remove("is-visible");
      document.body.classList.remove("holi-cursor-active");
    }

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.body.classList.remove("holi-cursor-active");
    };
  }, []);

  return (
    <div className="holi-cursor" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <path
          d="M8 5.5 39 24 25.8 26.4 19.2 40 8 5.5Z"
          fill="#ff3987"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="m13 12 21 12-8.8 1.5-5.1 10L13 12Z" fill="#ffd735" />
      </svg>
    </div>
  );
}