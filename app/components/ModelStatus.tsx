import StatusIndicator from "./StatusIndicator";

const ModelStatus = () => {
  return (
    <div className="w-full">
      <h2 className="text-h2 mb-4">Aan het zoeken...</h2>
      <p className="text-secondary-text">
        Wanneer het model klaar is worden de resultaten doorgestuurd naar uw
        e-mail. U mag dit scherm dus sluiten als u dit wilt.
      </p>
      <div className="mt-6">
        <StatusIndicator status="processing" />
      </div>
    </div>
  );
};

export default ModelStatus;
