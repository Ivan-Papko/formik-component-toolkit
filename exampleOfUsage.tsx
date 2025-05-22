import Button from '@mui/material/Button'
import { object, string } from 'yup'

import { useNotification } from '@cloudbees/shared-hooks/useNotification'
import { Drawer } from '@cloudbees/shared-patterns/Drawer'
import { Form } from '@cloudbees/shared-patterns/Form'
import type { ITeamWithMembers } from '@cloudbees/shared-types'

import type { ICreateOrUpdateTeamRequest } from '../OrganizationTeamsPage'

interface CreateOrUpdateTeamFormProps {
  onCancelButtonClick: () => void
  onValidFormSubmit: (teamData: ICreateOrUpdateTeamRequest) => void
  teamToUpdate: ITeamWithMembers
  organizationId: string
}

interface CreateOrUpdateTeamFormValues {
  team_name: string
  team_description: string
}

const validationSchema = object().shape({
  team_name: string()
    .required('Team name is required')
    .min(4, 'Team name should be at least 4 characters')
    .max(254, 'Team name is too long'),
  team_description: string().max(110, 'Team description is too long'), // Fits inside 4 lines
})

export const CreateOrUpdateTeamForm = (props: CreateOrUpdateTeamFormProps): JSX.Element => {
  const { organizationId, teamToUpdate } = props
  const { onCancelButtonClick, onValidFormSubmit } = props
  const { notify } = useNotification()

  const onSubmit = async (values: CreateOrUpdateTeamFormValues) => {
    try {
      const payload: ICreateOrUpdateTeamRequest = {
        metadata: {
          description: values.team_description,
        },
        name: values.team_name,
        default: false,
        organizationId: organizationId,
      }

      onValidFormSubmit(payload)
    } catch {
      notify('There was an error while creating a new Team', 'error')
    }
  }

  return (
    <Form.Context<CreateOrUpdateTeamFormValues>
      initialValues={{
        team_name: teamToUpdate.name,
        team_description: teamToUpdate.metadata?.description
          ? teamToUpdate.metadata.description
          : '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <>
        <Drawer.Header
          title={teamToUpdate.id === '' ? 'Create Team' : 'Update Team'}
          onClose={onCancelButtonClick}
        />
        <Drawer.Content>
          <Form.Form>
            <Form.TextField
              fullWidth
              id="team_name"
              name="team_name"
              label="Team name"
              inputProps={{ 'data-testid': 'create-team-team_name-input' }}
              margin="dense"
              helperText="Enter a unique name for this team."
            />
            <Form.TextField
              fullWidth
              multiline
              minRows={4}
              id="team_description"
              name="team_description"
              label="Team description"
              inputProps={{ 'data-testid': 'create-team-team_description-input' }}
              helperText="Enter an optional description for this team."
            />
          </Form.Form>
        </Drawer.Content>
        <Drawer.Footer>
          <Button variant="outlined" onClick={onCancelButtonClick}>
            Cancel
          </Button>

          <Form.Submit data-testid="create-or-update-team-submit-button">
            {teamToUpdate.id === '' ? 'Create Team' : 'Update Team'}
          </Form.Submit>
        </Drawer.Footer>
      </>
    </Form.Context>
  )
}
