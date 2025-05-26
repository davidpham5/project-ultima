import { createSignal } from "solid-js";
import { gsap } from "gsap";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  let btnRef: HTMLButtonElement | undefined;
  const handleClick = () => {
    setCount(count() + 1);
    if (btnRef) {
      gsap.fromTo(
        btnRef,
        { scale: 1 },
        { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 }
      );
    }
  };
  return (
    <button
      ref={btnRef}
      class="p-2 px-4 bg-blue-600 text-white rounded shadow"
      onClick={handleClick}>
      Count: {count()}
    </button>
  )
};