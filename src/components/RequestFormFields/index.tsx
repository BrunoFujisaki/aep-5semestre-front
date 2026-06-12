import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type RequestSelectOption = {
  value: string;
  label: string;
};

type RequestInputFieldProps = {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type RequestTextareaFieldProps = {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

type RequestSelectFieldProps = {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  options: RequestSelectOption[];
  disabled?: boolean;
  errorMessage?: string;
  className?: string;
  onValueChange?: (value: string) => void;
};

function RequestFieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

export const RequestInputField = ({
  id,
  label,
  value,
  placeholder,
  disabled,
  errorMessage,
  className,
  onChange,
}: RequestInputFieldProps) => {
  return (
    <div className={className ?? "flex flex-col space-y-2"}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={!!errorMessage}
      />
      <RequestFieldError message={errorMessage} />
    </div>
  );
};

export const RequestTextareaField = ({
  id,
  label,
  value,
  placeholder,
  disabled,
  errorMessage,
  className,
  onChange,
}: RequestTextareaFieldProps) => {
  return (
    <div className={className ?? "flex flex-col space-y-2"}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={!!errorMessage}
      />
      <RequestFieldError message={errorMessage} />
    </div>
  );
};

export const RequestSelectField = ({
  id,
  label,
  value,
  placeholder,
  options,
  disabled,
  errorMessage,
  className,
  onValueChange,
}: RequestSelectFieldProps) => {
  return (
    <div className={className ?? "flex flex-col space-y-2"}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className="w-full"
          aria-invalid={!!errorMessage}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <RequestFieldError message={errorMessage} />
    </div>
  );
};
