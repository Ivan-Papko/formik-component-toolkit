import { render } from '@cloudbees/shared-test-utils/render'

import { FormikWrapper } from './FormikWrapper'
import type { IFormWrapperProps } from './types'

describe('FormWrapper', () => {
  const factory = ({ children = '', ...props }: Partial<IFormWrapperProps> = {}) => {
    return render(<FormikWrapper {...props}>{children}</FormikWrapper>)
  }

  it('should render and update children', () => {
    const testId = 'Wrapper1234'
    const children = <span data-testid={testId}>Children</span>
    const { screen, rerender } = factory({ children })

    const updatedText = 'Wrapper Children'

    expect(screen.getByTestId(testId)).toBeInTheDocument()

    rerender(<FormikWrapper>{updatedText}</FormikWrapper>)

    expect(screen.getByText(updatedText)).toBeInTheDocument()
  })

  it('should render a Box component', () => {
    const { baseElement } = factory()

    expect(baseElement).toMatchSnapshot()
  })
})
