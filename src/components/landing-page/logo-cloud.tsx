import { Coffee, Heart, Moon, Star, Sun } from "lucide-react"; // Import random Lucide icons

export default function LogoCloud() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        <div className="col-span-2 flex max-h-12 w-full gap-4 lg:col-span-1 lg:justify-center">
          <Coffee />
          <p>Coffee Co.</p>
        </div>
        <div className="col-span-2 flex max-h-12 w-full gap-4 lg:col-span-1 lg:justify-center">
          <Heart />
          <p>Heart Co.</p>
        </div>
        <div className="col-span-2 flex max-h-12 w-full gap-4 lg:col-span-1 lg:justify-center">
          <Star />
          <p>Star Co.</p>
        </div>
        <div className="col-span-2 flex max-h-12 w-full gap-4 lg:col-span-1 lg:justify-center">
          <Sun />
          <p>Sun Co.</p>
        </div>
        <div className="col-span-2 flex max-h-12 w-full gap-4 lg:col-span-1 lg:justify-center">
          <Moon />
          <p>Moon Co.</p>
        </div>
      </div>
    </div>
  );
}
