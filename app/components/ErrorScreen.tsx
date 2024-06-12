import Button from "./Button";

interface ErrorScreenProps {
  onClear: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onClear }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-h2 mb-4 leading-tight md:leading-snug">
          Er is een fout opgetreden
        </h2>
        <p className="text-secondary-text">
          Er is een onverwachte fout opgetreden. Probeer opnieuw door een
          locatie opnieuw te selecteren.
        </p>
        <p className="mt-4">
          Contacteer ons wanneer dit probleem zich meermaals voordoet.
        </p>
      </div>
      <Button variant="secondary" className="self-end" onClick={onClear}>
        Selecteer een nieuwe regio
      </Button>
    </div>
  );
};

export default ErrorScreen;
