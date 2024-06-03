import { cn } from "@/lib/utils";
import Check from "./Icons/Check";

interface StatusIndicatorProps {
  status: "generating" | "processing" | "completed" | "error";
}

interface StatusIndicatorWrapperProps {
  children: React.ReactNode;
}

interface StatusIndicatorItemProps {
  stage: "completed" | "current" | "upcoming";
  title: string;
  text: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <StatusIndicatorWrapper>
      <StatusIndicatorItem
        stage={status === "generating" ? "current" : "completed"}
        title="Afbeeldingen ophalen"
        text="Satellietbeelden ophalen op basis van de gewenste regio."
      />
      <StatusIndicatorItem
        stage={
          status === "processing"
            ? "current"
            : status === "completed"
            ? "completed"
            : "upcoming"
        }
        title="Afbeeldingen door AI-model halen"
        text="Daken detecteren en onderscheiden van elkaar"
      />
      <StatusIndicatorItem
        stage={status === "completed" ? "current" : "upcoming"}
        title="Voltooid"
        text="Gegenereerde resultaten doormailen en weergeven."
      />
    </StatusIndicatorWrapper>
  );
};

const StatusIndicatorWrapper: React.FC<StatusIndicatorWrapperProps> = ({
  children,
}) => {
  return (
    <ol className="ml-2 relative border-l-[0.5px] border-light-gray">
      {children}
    </ol>
  );
};

const StatusIndicatorItem: React.FC<StatusIndicatorItemProps> = ({
  stage,
  title,
  text,
}) => {
  return (
    <li className="mb-10 ml-6 last:mb-0">
      {stage === "completed" ? (
        <Check className="absolute w-3 h-3 mt-1.5 -left-1.5 block" />
      ) : (
        <div
          className={cn(
            "absolute w-3 h-3 bg-white rounded-full mt-1.5 -left-1.5 border",
            stage === "current" ? "border-primary-orange" : "border-light-gray"
          )}
        />
      )}
      <h4
        className={cn(
          "mb-1 text-h3 font-light",
          stage === "current" ? "text-primary-orange" : "text-secondary-text"
        )}
      >
        {title}
      </h4>
      <p className="text-gray-500">{text}</p>
    </li>
  );
};

export default StatusIndicator;
