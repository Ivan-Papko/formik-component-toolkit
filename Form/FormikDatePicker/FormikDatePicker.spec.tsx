import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { object } from 'yup'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

import { FormikDatePicker } from './FormikDatePicker'
const factory = () =>
  render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form.Context
        initialValues={{ name: new Date('2024-03-20') }}
        onSubmit={jest.fn()}
        validationSchema={object().shape({})}
      >
        <Form.Form>
          <Form.Wrapper>
            <FormikDatePicker name="date" />
          </Form.Wrapper>
        </Form.Form>
      </Form.Context>
    </LocalizationProvider>,
  )

describe('FormikTimePicker', () => {
  it('should match snapshot', async () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should update date value on change', async () => {
    const { setup, screen } = factory()
    const user = setup()

    const input = screen.getByRole('textbox')
    await user.type(input, '04/21/2024', { method: 'userEvent' }) // Typing new date
    expect(input).toHaveValue('04/21/2024')
  })
})
