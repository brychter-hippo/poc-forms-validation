import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";

export const InsuredForm = () => {
  const { watch } = useFormContext();

  return (
    <>
      <Input label="First Name" name="primaryInsured.firstName" />
      <Input label="Middle Name" name="primaryInsured.middleName" />
      <Input label="Last Name" name="primaryInsured.lastName" />
      <Input label="Email" name="primaryInsured.emailAddress" type="email" />
      <Input label="Birthdate" name="primaryInsured.birthdate" type="date" />
      <Checkbox
        label="Include a second insured person"
        name="includeSecondaryInsured"
      />
      {watch("includeSecondaryInsured") && (
        <>
          <Input label="First Name" name="secondaryInsured.firstName" />
          <Input label="Last Name" name="secondaryInsured.lastName" />
          <Input
            label="Email"
            name="secondaryInsured.emailAddress"
            type="emailAddress"
          />
        </>
      )}
      <Button>Submit</Button>
    </>
  );
};
