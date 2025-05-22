import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { type TimePickerProps, TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useField } from 'formik'
export interface IFormikTimePickerProps {
  name: string
}

export const FormikTimePicker = ({
  name,
  ...props
}: TimePickerProps<Date> & IFormikTimePickerProps) => {
  const [field, { error }, { setValue }] = useField(name)

  return (
    <FormControl fullWidth error={Boolean(error)}>
      <TimePicker
        value={field.value}
        onChange={value => {
          setValue(value)
        }}
        {...props}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
