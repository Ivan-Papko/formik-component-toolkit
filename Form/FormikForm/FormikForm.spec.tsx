import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

const onSubmit = jest.fn()

const factory = () =>
  render(
    <Form.Context initialValues={{}} onSubmit={onSubmit} validateOnMount>
      <Form.Form>
        <Form.Wrapper>
          <Form.Submit>Submit</Form.Submit>
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('SubmitButton', () => {
  it('should render a form component', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should call handleSubmit on form submission', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useFormikContextMock = jest.spyOn(require('formik'), 'useFormikContext')
    useFormikContextMock.mockReturnValue({
      isSubmitting: false,
      dirty: true,
      isValid: true,
      handleSubmit: onSubmit,
    })
    const { setup, screen } = factory()
    const user = setup()

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalled()
  })
})
