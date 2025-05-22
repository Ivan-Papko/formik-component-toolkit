import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

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
          <Form.Submit>Submit</Form.Submit>
        </Form.Wrapper>
      </Form.Form>
    </Form.Context>,
  )

describe('SubmitButton', () => {
  it('should render a submitbutton component', () => {
    const { baseElement } = factory()
    expect(baseElement).toMatchSnapshot()
  })

  it('should show a loading spinner when submitting', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useFormikContextMock = jest.spyOn(require('formik'), 'useFormikContext')
    useFormikContextMock.mockReturnValue({
      isSubmitting: true,
      dirty: true,
    })
    const { screen } = factory()
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
  })
})
