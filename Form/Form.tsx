import { Formik } from 'formik'

import { FormikMultiSelect } from './FormikMultiSelect/FormikMultiSelect'
import { FormikAutocomplete } from './FormikAutocomplete'
import { FormikCheckbox } from './FormikCheckbox'
import { FormikCopyInput } from './FormikCopyInput'
import { FormikCountryField } from './FormikCountryField'
import { FormikDatePicker } from './FormikDatePicker'
import { FormikForm } from './FormikForm'
import { FormikPasswordField } from './FormikPasswordField'
import { FormikRegionField } from './FormikRegionField'
import { FormikSelect } from './FormikSelect'
import { FormikSubmit } from './FormikSubmit'
import { FormikSwitch } from './FormikSwitch'
import {
  type IFormikTextFieldProps,
  FormikTextField,
  FormikTextFieldWithRef,
} from './FormikTextField'
import { FormikTimePicker } from './FormikTimePicker'
import { FormikValidatingInput } from './FormikValidatingInput'
import { FormikWrapper } from './FormikWrapper'

/**
 * @deprecated Use `HookForm` instead.
 */
const Form = {
  Context: Formik,
  Form: FormikForm,
  Wrapper: FormikWrapper,
  TextField: FormikTextField,
  TextFieldWithRef: FormikTextFieldWithRef,
  PasswordField: FormikPasswordField,
  Checkbox: FormikCheckbox,
  ValidatingInput: FormikValidatingInput,
  CountryField: FormikCountryField,
  /**
   * @deprecated
   */
  RegionField: FormikRegionField,
  Submit: FormikSubmit,
  Switch: FormikSwitch,
  MultiSelect: FormikMultiSelect,
  Select: FormikSelect,
  Autocomplete: FormikAutocomplete,
  CopyInput: FormikCopyInput,
  TimePicker: FormikTimePicker,
  DatePicker: FormikDatePicker,
}

export { Form, type IFormikTextFieldProps }
export default Form
