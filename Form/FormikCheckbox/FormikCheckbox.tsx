import type { ChangeEvent, ReactNode } from 'react'
import Checkbox, { type CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import { type FieldHookConfig, useField } from 'formik'

export interface OtherProps extends CheckboxProps {
  label: ReactNode
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FormikCheckbox = (props: FieldHookConfig<string> & OtherProps) => {
  const [field, meta] = useField(props)
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            {...props}
            onChange={e => {
              field.onChange(e)
              props?.onChange?.(e)
            }}
          />
        }
        name={field.name}
        label={props.label}
      />
      {meta.touched && meta.error ? <FormHelperText error>{meta.error}</FormHelperText> : null}
    </FormGroup>
  )
}

FormikCheckbox.displayName = 'Checkbox'
