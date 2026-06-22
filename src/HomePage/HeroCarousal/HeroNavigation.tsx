import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

const HeroNavigation = ({
  onPrev,
  onNext,
}: HeroNavigationProps) => {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-10 top-[60%] z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-10 top-[60%] z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10"
      >
        <ArrowRight className="h-5 w-5 text-white" />
      </button>
    </>
  );
};

export default HeroNavigation;