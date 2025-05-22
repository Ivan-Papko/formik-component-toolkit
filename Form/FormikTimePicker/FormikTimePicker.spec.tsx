import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { object } from 'yup'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

import { FormikTimePicker } from './FormikTimePicker'
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

const factory = () =>
  render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form.Context
        initialValues={{ time: dayjs('2024-03-18T12:00:00') }}
        onSubmit={jest.fn()}
        validationSchema={object().shape({})}
      >
        <Form.Form>
          <Form.Wrapper>
            <FormikTimePicker
              views={['hours', 'minutes']}
              sx={{ width: '100%' }}
              name="time"
              ampm={false}
              format="HH:mm:ss"
            />
            ,
          </Form.Wrapper>
        </Form.Form>
      </Form.Context>
    </LocalizationProvider>,
    [],
  )

describe('FormikTimePicker', () => {
  it('should match snapshot', () => {
    const { container } = factory()
    expect(container).toMatchSnapshot()
  })

  it('should update date value on change', async () => {
    const { setup, screen } = factory()
    const user = setup()

    const input = screen.getByRole('textbox')
    await user.type(input, '13:30:05', { method: 'userEvent' }) // Typing new date

    expect(input).toHaveValue('13:30:05')
  })
})
