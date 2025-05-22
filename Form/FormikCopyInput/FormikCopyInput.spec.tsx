import { SnackbarProvider } from 'notistack'

import { render } from '@cloudbees/shared-test-utils/render'

import { Form } from '../Form'

import { FormikCopyInput } from '.'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

describe('FormikCopyInput', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <Form.Context
        initialValues={{}}
        onSubmit={() => {
          return
        }}
      >
        <Form.Form>
          <Form.Wrapper>
            <FormikCopyInput id={'test'} name={'test'} value={'test'} />,
          </Form.Wrapper>
        </Form.Form>
      </Form.Context>,
      [SnackbarProvider],
    )
    expect(container).toMatchSnapshot()
  })
})
