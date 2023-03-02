import {
  Close,
  Email,
  Launch,
  Phone,
  Portfolio,
  User as UserIcon,
  UserAvatar,
  UserIdentification
} from '@carbon/icons-react'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  TextInput,
  Text,
  Form,
  Spinner,
  Anchor,
  MaskedInput,
  FormExtendedEvent
} from 'grommet'
import { useState } from 'react'
import { atom, useAtom } from 'jotai'

import { ServerPageProps, User } from '../types/types'
import PatientsTable, { PatientsPageState } from './PatientsTable'
import theme from '../styles/theme'
import { useRouter } from 'next/router'

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
export const createPrescriptionModalState = atom<boolean>(false)

const patientsSearchPaginationState = atom<PatientsPageState>({
  step: '3',
  page: '1'
})

export default function CreatePrescriptionModal({ user }: ServerPageProps) {
  const [showCreatePrescription, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  async function handleSubmit(event: FormExtendedEvent) {}

  function clearForm() {}

  function handleRowClick(datum: User) {
    setSelectedPatient(datum)
  }

  function closeModal() {
    clearForm()
    setShowCreatePrescriptionModal(false)
  }
  return showCreatePrescription ? (
    <Layer
      onEsc={closeModal}
      onClickOutside={closeModal}
      position="center"
      full
      style={{ display: 'block', overflow: 'scroll' }}
    >
      <Box pad="large" overflow="scroll">
        {!isFetching ? (
          <Box
            direction="column"
            overflow="scroll"
            gap="small"
            data-cy="create-prescription-modal"
          >
            <Box flex={false} direction="row" justify="between">
              <Heading level={4} margin="none">
                Create Prescription
              </Heading>
              <Button
                icon={<Close size={16} />}
                onClick={closeModal}
                data-cy="close-modal"
              />
            </Box>
            <Box gap="small">
              <Text size="medium">Create Prescription For Pickup</Text>
            </Box>
            <Box margin={{ vertical: 'medium' }} overflow="scroll">
              <Form onSubmit={handleSubmit}>
                <Box gap="medium">
                  <Text size="small">Search and Select a Patient</Text>
                  <Box border pad="small" round="small">
                    <PatientsTable
                      patientsPageState={patientsSearchPaginationState}
                      defaultPage={1}
                      defaultStep={3}
                      onRowClickOverride={handleRowClick}
                      filterOnEnabled
                    />
                  </Box>
                  <Text size="small">Patient Currently Selected:</Text>
                  {selectedPatient && (
                    <Box
                      border={{ color: theme.global.colors['neutral-4'] }}
                      round="small"
                    >
                      <Box
                        direction="row"
                        gap="small"
                        pad="medium"
                        align="center"
                        justify="stretch"
                      >
                        <Text size="medium">
                          First Name:{' '}
                          <Anchor
                            href={`/patients/${selectedPatient.Patient?.id}`}
                          >
                            {selectedPatient.firstName}
                          </Anchor>
                        </Text>
                        <Text>
                          Last Name:{' '}
                          <Anchor
                            href={`/patients/${selectedPatient.Patient?.id}`}
                          >
                            {selectedPatient.lastName}
                          </Anchor>
                        </Text>
                        <Text>
                          Phone Number:{' '}
                          <Anchor
                            href={`/patients/${selectedPatient.Patient?.id}`}
                          >
                            {selectedPatient.phoneNumber}
                          </Anchor>
                        </Text>
                        <Text>
                          Email:{' '}
                          <Anchor
                            href={`/patients/${selectedPatient.Patient?.id}`}
                          >
                            {selectedPatient.email}
                          </Anchor>
                        </Text>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box
                  flex="grow"
                  overflow="auto"
                  pad={{ vertical: 'medium' }}
                ></Box>
                <Box flex={false} as="footer" gap="small">
                  <Box pad={{ left: 'small' }}>
                    <Text size="medium">
                      Verify the information you have entered is corrrect.
                    </Text>
                  </Box>
                  <Button
                    type="submit"
                    label="Create Prescription"
                    id="submit-create-prescription-form"
                    primary
                    style={{
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px'
                    }}
                    data-cy="submit-create-prescription-form"
                  />
                </Box>
              </Form>
            </Box>
          </Box>
        ) : (
          <Box pad="xlarge" align="center" gap="medium" animation="fadeIn">
            <Text>Creating Prescription...</Text>
            <Spinner
              size="xlarge"
              border={false}
              background="linear-gradient(to right, #fc466b, #683ffb)"
            />
          </Box>
        )}
      </Box>
    </Layer>
  ) : null
}
