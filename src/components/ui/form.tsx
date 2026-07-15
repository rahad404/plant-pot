"use client"

import * as React from "react"
import * as ReactHookForm from "react-hook-form"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormFieldContextValue<
  TFieldValues extends ReactHookForm.FieldValues = ReactHookForm.FieldValues,
  TName extends ReactHookForm.FieldPath<TFieldValues> = ReactHookForm.FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormItemContext = React.createContext<string>("")

const Form = ReactHookForm.FormProvider

const FormField = <
  TFieldValues extends ReactHookForm.FieldValues = ReactHookForm.FieldValues,
  TName extends ReactHookForm.FieldPath<TFieldValues> = ReactHookForm.FieldPath<TFieldValues>,
>({
  ...props
}: React.ComponentProps<typeof ReactHookForm.Controller<TFieldValues, TName>>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <ReactHookForm.Controller<TFieldValues, TName> {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = ReactHookForm.useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name)
  const id = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={id}>
      <div ref={ref} data-slot="form-item" className={cn("grid gap-1", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      data-slot="form-label"
      data-error={!!error ? "" : undefined}
      className={cn(!!error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot.Root>,
  React.ComponentPropsWithoutRef<typeof Slot.Root>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      ref={ref}
      id={formItemId}
      data-slot="form-control"
      aria-describedby={
        !!error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
