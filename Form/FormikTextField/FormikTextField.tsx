import { forwardRef, useEffect } from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import TextField, { type StandardTextFieldProps } from '@mui/material/TextField'
import { useField, useFormikContext } from 'formik'

export interface IFormikTextFieldProps extends StandardTextFieldProps {
  id: string
  // In case TextField is used to render Autocomplete, we don't want error management here
  disableErrorDisplay?: boolean
  dataTestId?: string
}

export const FormikTextFieldWithRef = forwardRef((props: IFormikTextFieldProps, ref) => (
  <FormikTextField {...props} inputRef={ref} />
))

export const FormikTextField = ({
  disableErrorDisplay,
  dataTestId,
  ...props
}: IFormikTextFieldProps) => {
  const [field, meta, { setValue }] = useField(props.id)
  const { isSubmitting } = useFormikContext()

  useEffect(() => {
    if (props.defaultValue) setValue(props.defaultValue)
  }, [props.defaultValue])

  const { value, ...fieldProps } = field

  return (
    <TextField
      inputProps={{ 'data-testid': `${field.name}-input` }}
      disabled={isSubmitting}
      value={value !== undefined ? value : ''}
      {...fieldProps}
      {...props}
      error={meta.touched && meta.error !== undefined}
      helperText={
        /* ToDo: CBP-3147 - component="span" is a workaround to avoid the warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.
            After the MUI upgrade, we can remove component="span" and define the parent component as a <div>. */
        <>
          {!disableErrorDisplay && meta.touched && meta.error ? (
            <FormHelperText component="span" sx={{ m: 0, display: 'block' }}>
              {meta.error}
            </FormHelperText>
          ) : null}

          {props.helperText ? (
            <FormHelperText component="span" error={false} sx={{ m: 0 }}>
              {props.helperText}
            </FormHelperText>
          ) : null}
        </>
      }
    />
  )
}

FormikTextField.displayName = 'TextField'
FormikTextFieldWithRef.displayName = 'TextFieldWithRef'

export default FormikTextField
