import { useField } from 'formik'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(),
}))

const handleChange = jest.fn()

const factory = () =>
  render(
    <Form.Context
      initialValues={{}}
      onSubmit={() => {
        return
      }}
    >
      <Form.Form>
        <Form.Wrapper>
          <Form.Switch id="testid" label="switch test" onChange={handleChange} />
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('Switch', () => {
  beforeEach(() => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: false, onChange: jest.fn() },
      { touched: false, error: '' },
    ])
  })
  it('should render a switch component', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should call custom onChange function when provided', async () => {
    const { setup, screen } = factory()
    const user = setup()
    const switchInput = screen.getByRole('checkbox', { name: /switch test/i })
    await user.click(switchInput)
    expect(handleChange).toHaveBeenCalled()
  })

  it('should show error message when there is an error', () => {
    ;(useField as jest.Mock).mockImplementation(() => [
      { value: false, onChange: jest.fn() },
      { touched: true, error: 'Error message' },
    ])
    const { screen } = factory()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
