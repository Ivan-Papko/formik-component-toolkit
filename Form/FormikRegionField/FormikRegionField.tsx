import { useEffect, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import allCountries from 'country-region-data/data.json'
import { useField } from 'formik'

import type { ICountry } from '../types'

export interface OtherProps {
  id: string
  country?: string
  countries?: ICountry[]
}

export const FormikRegionField = ({
  country,
  countries = allCountries as ICountry[],
  disabled,
  ...rest
}: TextFieldProps & OtherProps) => {
  const [field, meta, helpers] = useField(rest.id)

  useEffect(() => {
    helpers.setValue(field.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const activeRegion = regionOptions.find(r => r === field.value) || ''
    helpers.setValue(activeRegion)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country])

  const regionOptions = useMemo(() => {
    if (!!country && !!countries) {
      return (
        countries.find(item => item.countryName === country)?.regions.map(region => region.name) ||
        []
      )
    } else {
      return []
    }
  }, [country, countries])

  return (
    <FormControl fullWidth>
      <Autocomplete
        disablePortal
        id="region-select"
        options={regionOptions}
        disabled={disabled}
        onChange={(event, option) => helpers.setValue(option)}
        isOptionEqualToValue={(option, value) => option === value || value === ''}
        value={field.value || ''} // undefined value make the component uncontrolled, assigned empty to make sure it's a controlled component
        renderInput={params => (
          <TextField
            {...params}
            {...field}
            {...rest}
            inputProps={{ ...params.inputProps }}
            error={meta.touched && meta.error !== undefined}
            helperText={meta.touched && meta.error ? meta.error : undefined}
          />
        )}
      />
    </FormControl>
  )
}

FormikRegionField.displayName = 'RegionField'
