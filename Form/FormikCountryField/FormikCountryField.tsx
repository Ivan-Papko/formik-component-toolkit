import { useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useField } from 'formik'
import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'

import type { ICountry } from '../types'

export const FormikCountryField = (
  props: TextFieldProps & { countries?: ICountry[]; id: string },
) => {
  const [field, meta, helpers] = useField(props.id)
  const disabled = props.disabled || false
  const countryOptions = useMemo(() => {
    if (props.countries) {
      return props.countries.map((c: ICountry) => c.countryName)
    } else {
      const wordCountries = countries
      countries.registerLocale(en)
      return Object.keys(wordCountries.getNames('en')).map(countryCode =>
        wordCountries.getName(countryCode, 'en'),
      )
    }
  }, [])

  return (
    <FormControl fullWidth>
      <Autocomplete
        disablePortal
        id="country-select"
        autoHighlight
        disabled={disabled}
        value={field.value || ''}
        options={countryOptions}
        isOptionEqualToValue={(option, value) => option === value || value === ''}
        onChange={(event, option) => helpers.setValue(option)}
        renderInput={params => (
          <TextField
            {...params}
            {...field}
            {...props}
            inputProps={{ ...params.inputProps }}
            error={meta.touched && meta.error !== undefined}
            helperText={meta.touched && meta.error ? meta.error : undefined}
            value={field.value}
          />
        )}
      />
    </FormControl>
  )
}

FormikCountryField.displayName = 'CountryField'
