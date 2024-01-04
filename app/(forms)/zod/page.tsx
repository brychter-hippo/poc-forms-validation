"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InsuredForm } from "@/components/forms";
import { subYears } from "date-fns";

const baseSchema = z.object({
  primaryInsured: z.object({
    emailAddress: z.string().email(),
    firstName: z.string().trim().min(1, { message: "First name is required" }),
    lastName: z.string().trim().min(1, { message: "Last name is required" }),
    middleName: z.string().optional(),
    birthdate: z.coerce
      .date()
      .min(new Date("1970-01-01"), { message: "Date cannot be before 1970" })
      .max(subYears(new Date(), 18), {
        message: "You must be at least 18 years old",
      }),
  }),
});

const secondaryInsuredSchema = z.discriminatedUnion("includeSecondaryInsured", [
  z.object({
    includeSecondaryInsured: z.literal(true),
    secondaryInsured: z.object({
      firstName: z.string(),
      lastName: z.string(),
      emailAddress: z.string().email().optional(),
    }),
  }),
  z.object({
    includeSecondaryInsured: z.literal(false),
  }),
]);

const validationSchema = z.intersection(baseSchema, secondaryInsuredSchema);

type FormValues = z.infer<typeof validationSchema>;

export default function FormWithZod() {
  const form = useForm<FormValues>({
    reValidateMode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      includeSecondaryInsured: false,
    },
  });

  const { handleSubmit: createSubmitHandler } = form;

  const handleSubmit = createSubmitHandler(async (formValues) => {
    console.group("\nFormWithZod");
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

  console.group("\nFormWithZod Errors");
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
