import Button from "./Button";

interface InfoStepProps {
  onSubmit: () => void;
}

const InfoStep: React.FC<InfoStepProps> = ({ onSubmit }) => (
  <div className="w-full">
    <h2 className="text-h2 mb-4">Platte daken herkennen in gewenste regio</h2>
    <p className="text-secondary-text">
      Klik op de onderstaande knop om het AI model te laten zoeken op het aantal
      platte daken in de ingevoerde regio. Dit kan enkele minuten duren.
    </p>
    <Button onClick={onSubmit} className="mt-8">
      Start met zoeken
    </Button>
  </div>
);

export default InfoStep;
