import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputErrorProps {
  error:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}

const InputError: React.FC<InputErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <span className="text-xs text-red-600 font-light block">
      {error.toString()}
    </span>
  );
};

export default InputError;
