import { z } from "zod";
import Button from "./Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import Label from "./Label";
import InputError from "./InputError";
import { cn } from "@/lib/utils";

interface InfoStepProps {
  onSubmit: SubmitHandler<FormValues>;
}

export interface FormValues {
  email: string;
}

// Define the schema for the form with error messages
const formSchema = z.object({
  email: z
    .string()
    .min(1, "E-mailadres is verplicht")
    .email("Ongeldig e-mailadres"),
});

const InfoStep: React.FC<InfoStepProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="w-full">
      <h2 className="text-h2 mb-4 leading-tight md:leading-snug">Platte daken herkennen in gewenste regio</h2>
      <p className="text-secondary-text">
        Klik op de onderstaande knop om het AI model te laten zoeken op het
        aantal platte daken in de ingevoerde regio. Dit kan enkele minuten
        duren.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <Label>
          E-mail<span className="text-primary-orange">*</span>
          <Input
            {...register("email")}
            placeholder="Voer uw e-mailadres in"
            className={cn(errors.email && "border-red-600")}
            type="email"
            autoComplete="email"
          />
        </Label>
        <InputError error={errors.email?.message} />
        <Button type="submit" className="mt-8">
          Start met zoeken
        </Button>
      </form>
    </div>
  );
};

export default InfoStep;
