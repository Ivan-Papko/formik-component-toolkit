import Autocomplete, {
  type AutocompleteChangeReason,
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
  type AutocompleteRenderOptionState,
} from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import type { AutocompleteValue } from '@mui/material/useAutocomplete'
import { type FieldMetaProps, useField } from 'formik'

export interface FormikAutocompleteProps<
  T extends string | { [key: string]: any },
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
  id: string
  options: ReadonlyArray<T>
  label?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  renderErrors?: () => React.ReactNode
  renderHelper?: () => React.ReactNode
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
  renderOption?: (props: any, option: T, state: AutocompleteRenderOptionState) => React.ReactNode
}

export const FormikAutocomplete = <
  T extends string | { [key: string]: any },
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  id,
  label,
  required = false,
  onChange,
  onInputChange,
  renderInput,
  renderErrors,
  renderHelper,
  helperText,
  renderOption,
  disablePortal = true,
  ...props
}: FormikAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => {
  const [field, meta, helpers] = useField(id || '')

  const defaultRenderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      required={required}
      label={label}
      error={meta.touched && !!meta.error}
      fullWidth
    />
  )

  const defaultOnChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason,
  ) => {
    helpers.setValue(value)
  }

  const defaultRenderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: T) => (
    <ListItem {...props} key={typeof option === 'string' ? option : option.toString()}>
      <ListItemText
        sx={{ my: '3px' }}
        primary={typeof option === 'string' ? option : option.toString()}
      />
    </ListItem>
  )

  const defaultRenderErrors = (meta: FieldMetaProps<unknown>) =>
    meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>

  const defaultRenderHelperText = (meta: FieldMetaProps<unknown>, helperText?: string) =>
    !meta.error && helperText && <FormHelperText>{helperText}</FormHelperText>

  return (
    <FormControl fullWidth error={meta.touched && !!meta.error}>
      <Autocomplete
        id={id}
        disablePortal={disablePortal}
        // onBlur is required to make sure the error is displayed
        onBlur={() => helpers.setTouched(true)}
        renderInput={renderInput || defaultRenderInput}
        onChange={onChange || defaultOnChange}
        onInputChange={onInputChange}
        renderOption={renderOption || defaultRenderOption}
        value={field.value}
        {...props}
      />

      {renderErrors?.() || defaultRenderErrors(meta)}
      {renderHelper?.() || defaultRenderHelperText(meta, helperText)}
    </FormControl>
  )
}
