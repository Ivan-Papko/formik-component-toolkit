import { useState } from 'react'
import CheckBox from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useField } from 'formik'

const selectAllOption = 'Select all'
const checkboxIcon = <CheckBoxOutlineBlank fontSize="small" />
const checkedCheckboxIcon = <CheckBox fontSize="small" />

type FormikMultiSelectProps = TextFieldProps & {
  options?: string[]
  freeSolo?: boolean
}

export const FormikMultiSelect = ({ freeSolo, ...props }: FormikMultiSelectProps) => {
  const [isAllSelected, setIsAllSelected] = useState(false)

  const [field, meta, helpers] = useField(props.id || '')

  const selectFilter = createFilterOptions({
    stringify: (option: string) => option,
  })

  const onChange = (selectedOptions: string[]) => {
    const selectAllClicked = selectedOptions.some(option => option === selectAllOption)
    if (selectAllClicked) {
      if (!isAllSelected) {
        setIsAllSelected(true)
        helpers.setValue(props.options)
      } else {
        setIsAllSelected(false)
        helpers.setValue([])
      }
    } else {
      if (freeSolo) {
        helpers.setValue(selectedOptions.length === 0 ? undefined : selectedOptions)
        setIsAllSelected(false)
      } else {
        helpers.setValue(selectedOptions.filter(option => option !== selectAllOption))
        setIsAllSelected(selectedOptions.length === props.options?.length)
      }
    }
  }

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={field.value || []}
        freeSolo={freeSolo}
        // If autocomplete is freeform, want to give users the option to add values on blur not just on enter key hit
        autoSelect={freeSolo}
        // onBlur is required to make sure the error is displayed
        onBlur={() => helpers.setTouched(true)}
        multiple
        options={props.options ? [selectAllOption, ...props.options] : []}
        disableCloseOnSelect
        filterOptions={(options, params) => {
          if (freeSolo) {
            return []
          }
          const realOptions = options.filter(option => option !== selectAllOption)
          const filtered = selectFilter(realOptions, params)
          return [selectAllOption, ...filtered]
        }}
        getOptionLabel={option => option}
        onChange={(event, selectedOptions) => onChange(selectedOptions)}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={checkboxIcon}
              checkedIcon={checkedCheckboxIcon}
              checked={option === selectAllOption ? isAllSelected : selected}
            />
            {option}
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            {...props}
            error={meta.touched && meta.error !== undefined}
            helperText={meta.touched && meta.error ? meta.error : undefined}
          />
        )}
      />
    </FormControl>
  )
}

export default FormikMultiSelect
