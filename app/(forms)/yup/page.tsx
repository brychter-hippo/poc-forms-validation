"use client";

import { Insured } from "@/types";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { InsuredForm } from "@/components/forms";
import { subYears } from "date-fns";

const emptyAsUndefined = (value: string) => value || undefined;

const nameRequiredSchema = yup.string().required();

const validationSchema = yup.object({
  includeSecondaryInsured: yup.boolean(),
  primaryInsured: yup.object({
    emailAddress: yup.string().email().required(),
    firstName: nameRequiredSchema,
    lastName: nameRequiredSchema,
    middleName: yup.string().optional().transform(emptyAsUndefined),
    birthdate: yup
      .date()
      .min(new Date("1970-01-01"), "Date cannot be before 1970")
      .max(subYears(new Date(), 18), "You must be at least 18 years old"),
  }),
  secondaryInsured: yup
    .mixed<Required<Pick<Insured, "firstName" | "lastName" | "emailAddress">>>()
    .optional()
    .when("includeSecondaryInsured", {
      is: true,
      otherwise: undefined,
      then: () =>
        yup.object({
          firstName: nameRequiredSchema,
          lastName: nameRequiredSchema,
          emailAddress: yup
            .string()
            .email()
            .optional()
            .transform(emptyAsUndefined),
        }),
    }),
});

type FormValues = yup.InferType<typeof validationSchema>;

export default function FormWithYup() {
  const form = useForm<FormValues>({
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const handleSubmit = form.handleSubmit(async (formValues) => {
    console.group("\nFormWithYup");
    /**
     * output form values are not including optional values
     * as undefined. They are just not present in the object.
     * We have to use .transform() with emptyAsUndefined helper
     * to make sure that optional values are undefined when empty.
     */
    console.log(formValues);

    /**
     * formValues.secondaryInsured can be undefined
     * or have three properties: firstName, lastName, emailAddress
     */
    console.log(formValues.secondaryInsured?.firstName);

    /**
     * here situation is not changed
     * formValues.secondaryInsured can be undefined
     * Yup does not know that we have checked includeSecondaryInsured
     * and that secondaryInsured is not undefined
     */
    if (formValues.includeSecondaryInsured) {
      console.log(formValues.secondaryInsured?.firstName);
      console.log(formValues.secondaryInsured?.lastName);
      console.log(formValues.secondaryInsured?.emailAddress);
    }
    console.groupEnd();
  });

  console.group("\nFormWithYup Errors");
  console.log(form.formState.errors);
  console.groupEnd();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InsuredForm />
      </form>
    </Form>
  );
}
