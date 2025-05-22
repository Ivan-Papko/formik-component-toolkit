import { forwardRef } from 'react'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectProps } from '@mui/material/Select'
import type { TextFieldProps } from '@mui/material/TextField'
import type { SxProps } from '@mui/system'
import { useField } from 'formik'

export interface FormikSelectProps {
  dropdownItems: string[]
  // Given a value (which is always something from the
  // dropdownItems prop), you can return a custom (or translated)
  // text using this function.
  customRenderFn?: (value: string) => string
  disabledItems?: string[]
  autoFocus?: boolean

  // if true, will show the first item in dropdownItems
  populateOnInitialLoad?: boolean
  disabled?: boolean
  placeholder?: string
  menuItemSx?: SxProps
}

export const FormikSelect = forwardRef(
  (
    props: SelectProps &
      Pick<TextFieldProps, 'helperText'> &
      FormikSelectProps & {
        'data-testid'?: string
      },
    ref,
  ) => {
    const [field, meta, helpers] = useField(props.id || '')

    return (
      <FormControl fullWidth error={!!meta.touched && !!meta.error}>
        {props.placeholder && (
          <InputLabel
            id={`select-label-${props.id}`}
            {...(!field.value && props.size === 'small' ? { sx: { top: '-8px' } } : {})}
            required={props.required}
          >
            {props.placeholder}
          </InputLabel>
        )}
        <Select
          id={props.id}
          autoFocus={props.autoFocus || false}
          required={props.required}
          labelId={`select-label-${props.id}`}
          label={props.placeholder || ''}
          data-testid={`select-${props.id}`}
          onChange={(event, child) => {
            helpers.setValue(event.target.value)
            props?.onChange?.(event, child)
            helpers.setTouched(true, false)
          }}
          defaultValue={props.populateOnInitialLoad ? props.dropdownItems[0] : ''}
          sx={props.sx}
          size={props.size}
          disabled={props.disabled}
          inputProps={{ 'data-testid': props['data-testid'] }}
          inputRef={ref}
          value={field.value || ''}
          // onBlur is required to make sure the error is displayed
          onBlur={() => helpers.setTouched(true)}
        >
          {props.dropdownItems.map((dropdownItem: string) => (
            <MenuItem
              sx={props.menuItemSx}
              value={dropdownItem}
              data-testid={`dropdown-item-${dropdownItem}`}
              key={dropdownItem}
              disabled={props.disabledItems ? props.disabledItems.includes(dropdownItem) : false}
            >
              {props.customRenderFn?.(dropdownItem) ?? dropdownItem}
            </MenuItem>
          ))}
        </Select>
        {(meta.touched && meta.error) || props.helperText ? (
          <FormHelperText sx={{ mx: 1.75, mt: 0.5 }}>
            <>
              {meta.touched && meta.error ? (
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
          </FormHelperText>
        ) : null}
      </FormControl>
    )
  },
)
