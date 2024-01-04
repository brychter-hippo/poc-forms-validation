"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { differenceInYears, isAfter, subDays } from "date-fns";

type PrimaryInsuredValues = {
  primaryInsured: {
    firstName: string;
    middleName?: string | undefined;
    lastName: string;
    emailAddress: string;
  };
};

type SecondaryInsuredValues = {
  includeSecondaryInsured: true;
  secondaryInsured: {
    firstName: string;
    lastName: string;
    emailAddress?: string | undefined;
  };
};

type FormValues =
  | ({
      includeSecondaryInsured: false;
    } & PrimaryInsuredValues)
  | (PrimaryInsuredValues & SecondaryInsuredValues);

const isAdult = (value: string) => {
  const birthdate = new Date(value);
  const now = new Date();
  const age = differenceInYears(now, birthdate);

  if (age < 18) {
    return "You must be at least 18 years old";
  }

  return true;
};

const isAtLeastMinimal = (value: string) => {
  return (
    isAfter(new Date(value), subDays(new Date("1970-01-01"), 1)) ||
    "Date cannot be before 1970"
  );
};

export default function FormNative() {
  const form = useForm<FormValues>({
    reValidateMode: "onChange",
    defaultValues: {
      includeSecondaryInsured: false,
    },
  });

  const { handleSubmit: createSubmitHandler, watch } = form;

  const handleSubmit = createSubmitHandler(async (formValues) => {
    console.group("\nFormNative");
    /**
     * output form values are complete.
     * All optional values are present as undefined.
     */
    console.log(formValues);

    /**
     * formValues.secondaryInsured not exits here
     * because this object is accessible only
     * when includeSecondaryInsured is true
     */
    // @ts-ignore
    console.log(formValues?.secondaryInsured?.firstName);

    /**
     * here instead all properties from secondaryInsured
     * are accessible due to proper type union
     */
    if (formValues.includeSecondaryInsured) {
      console.log(formValues.secondaryInsured.firstName);
      console.log(formValues.secondaryInsured.lastName);
      console.log(formValues.secondaryInsured.emailAddress);
    }
    console.groupEnd();
  });

  console.group("\nFormNative Errors");
  console.log(form.formState.errors);
  console.groupEnd();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="First Name"
          name="primaryInsured.firstName"
          rules={{ required: "Required" }}
        />
        <Input label="Middle Name" name="primaryInsured.middleName" />
        <Input
          label="Last Name"
          name="primaryInsured.lastName"
          rules={{
            required: "Required",
            minLength: { value: 10, message: "Last name is too short" },
          }}
        />
        <Input label="Email" name="primaryInsured.emailAddress" type="email" />
        <Input
          label="Birthdate"
          name="primaryInsured.birthdate"
          type="date"
          rules={{
            required: "Required",
            validate: {
              isAdult,
              isAtLeastMinimal,
            },
          }}
        />
        <Checkbox
          label="Include a second insured person"
          name="includeSecondaryInsured"
        />
        {watch("includeSecondaryInsured") && (
          <>
            <Input
              label="First Name"
              name="secondaryInsured.firstName"
              rules={{ required: "Required" }}
            />
            <Input
              label="Last Name"
              name="secondaryInsured.lastName"
              rules={{ required: "Required" }}
            />
            <Input
              label="Email"
              name="secondaryInsured.emailAddress"
              type="email"
            />
          </>
        )}
        <Button>Submit</Button>
      </form>
    </Form>
  );
}
