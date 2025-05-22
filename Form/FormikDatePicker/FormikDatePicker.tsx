import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { type DatePickerProps, DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useField } from 'formik'

export const FormikDatePicker = ({ name, ...props }: DatePickerProps<Date> & { name: string }) => {
  const [field, { error }, { setValue }] = useField(name)
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <DatePicker
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
