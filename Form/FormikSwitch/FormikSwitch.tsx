import type { ReactNode } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Switch, { type SwitchProps } from '@mui/material/Switch'
import { useField, useFormikContext } from 'formik'

export interface IFormikSwitchProps extends SwitchProps {
  label: ReactNode
  id: string
}
export const FormikSwitch = (props: IFormikSwitchProps) => {
  const [field, meta] = useField(props.id)
  const { setFieldValue } = useFormikContext()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event, event.target.checked)
    }
    setFieldValue(props.id, event.target.checked)
  }

  return (
    <FormGroup sx={{ alignItems: 'start' }}>
      <FormControlLabel
        control={<Switch {...field} {...props} checked={field.value} onChange={onChange} />}
        label={props.label}
      />
      {meta.touched && meta.error ? <FormHelperText error>{meta.error}</FormHelperText> : null}
    </FormGroup>
  )
}

FormikSwitch.displayName = 'Switch'
