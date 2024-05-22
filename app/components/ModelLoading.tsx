import LoadingAnimation from "@/lib/config/loading-animation.json";
import Lottie from "lottie-react";

const ModelLoading = () => (
  <div className="w-full h-full relative">
    <h2 className="text-h2 mb-4">Aan het zoeken...</h2>
    <div className="absolute inset-0 flex justify-center items-center flex-col pb-12">
      <Lottie
        animationData={LoadingAnimation}
        style={{ width: 150, height: 150 }}
        loop
      />
      <div className="text-secondary-text text-small text-center -mt-6">
        Dit kan enkele minuten duren.
        <br />
        Sluit dit venster niet.
      </div>
    </div>
  </div>
);

export default ModelLoading;
