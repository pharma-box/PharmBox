import { Close } from '@carbon/icons-react'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  Text,
  Form,
  Spinner,
  Anchor,
  FormExtendedEvent,
  TextArea,
  Select
} from 'grommet'
import { useState } from 'react'
import { atom, useAtom } from 'jotai'
import { ServerPageProps, User } from '../types/types'
import PatientsTable, { PatientsPageState } from './PatientsTable'
import theme from '../styles/theme'
import { formatPhoneNumber } from '../helpers/validators'
import { useLockerboxes } from '../hooks/lockerbox'
import { toast } from 'react-toastify'
import { usePrescriptions } from '../hooks/prescriptions'

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
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [prescriptionName, setPrescriptionName] = useState<string>('')
  const [selectPatientError, setSelectPatientError] = useState<boolean>(false)
  const { emptyLockerboxes } = useLockerboxes(user)
  const [lockerNumber, setLockerNumber] = useState<number | undefined>(
    emptyLockerboxes?.map((locker) => locker.label)[0]
  )
  const { createPrescription } = usePrescriptions({ user })

  async function handleSubmit(
    event: FormExtendedEvent<{ prescriptionName: string }>
  ): Promise<boolean> {
    const {
      value: { prescriptionName }
    } = event

    if (!selectedPatient) {
      toast.warning('You must select a patient.')
      setSelectPatientError(true)
      return false
    }
    setIsFetching(true)

    const locker = emptyLockerboxes?.find(
      (locker) => locker.label === lockerNumber
    )

    if (!locker) {
      toast.error('The current selected locker is invalid.')
      setIsFetching(false)
      return false
    }
    const success = await createPrescription({
      name: prescriptionName,
      patientId: selectedPatient.Patient?.id,
      lockerBoxId: locker.id
    })

    setIsFetching(false)

    if (success) {
      closeModal()
      return true
    }
    return false
  }

  function clearForm() {
    setPrescriptionName('')
    setSelectedPatient(null)
  }

  function handleRowClick(datum: User) {
    if (selectPatientError) {
      setSelectPatientError(false)
    }
    setSelectedPatient(datum)
  }

  function closeModal() {
    clearForm()
    setShowCreatePrescriptionModal(false)
  }

  if (showCreatePrescription) {
    if (emptyLockerboxes?.length === 0) {
      return (
        <Layer
          onEsc={closeModal}
          onClickOutside={closeModal}
          position="center"
          style={{ display: 'block', overflow: 'scroll' }}
          full
        >
          <Box
            direction="column"
            overflow="scroll"
            gap="small"
            data-cy="create-prescription-modal"
            pad="large"
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
            <Box
              pad="medium"
              border={{ color: theme.global.colors['status-critical'] }}
              round="small"
            >
              <Text color={theme.global.colors['status-critical']}>
                All Locker Boxes Full
              </Text>
            </Box>
          </Box>
        </Layer>
      )
    }
    return (
      <Layer
        onEsc={closeModal}
        onClickOutside={closeModal}
        position="center"
        full
        style={{ display: 'block', overflow: 'scroll' }}
      >
        <Box pad="large" overflow="scroll">
          {!isFetching && emptyLockerboxes?.length && (
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
              <Box margin={{ vertical: 'medium' }} overflow="scroll">
                {emptyLockerboxes.length && (
                  <Form onSubmit={handleSubmit}>
                    <Box gap="medium">
                      <Box
                        border={{
                          color: selectPatientError
                            ? theme.global.colors['status-critical']
                            : theme.global.colors['light-3']
                        }}
                        pad="small"
                        round="small"
                      >
                        <PatientsTable
                          patientsPageState={patientsSearchPaginationState}
                          defaultPage={1}
                          defaultStep={3}
                          onRowClickOverride={handleRowClick}
                          filterOnEnabled
                        />
                      </Box>
                      {selectedPatient ? (
                        <Box
                          border={{ color: theme.global.colors['neutral-2'] }}
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
                                {formatPhoneNumber(
                                  `${selectedPatient.phoneNumber}`
                                )}
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
                      ) : (
                        <Box
                          border={{
                            color: theme.global.colors['status-critical']
                          }}
                          round="small"
                          pad="medium"
                        >
                          <Text color={theme.global.colors['status-critical']}>
                            Select Patient From Table
                          </Text>
                        </Box>
                      )}
                      <Box border round="small" pad="medium">
                        <FormField
                          label="Prescription Name / Description"
                          htmlFor="prescriptionName"
                          name="prescriptionName"
                          required
                        >
                          <TextArea
                            size="small"
                            id="prescriptionName"
                            name="prescriptionName"
                            placeholder="Name / Description"
                            a11yTitle="Prescription Name Input"
                            value={prescriptionName}
                            onChange={(event) =>
                              setPrescriptionName(event.target.value)
                            }
                          />
                        </FormField>
                      </Box>
                      <Box border round="small" pad="medium">
                        <FormField
                          label="Locker Box"
                          htmlFor="lockerBox"
                          name="lockerBox"
                        >
                          <Select
                            id="lockerBox"
                            name="lockerBox"
                            options={
                              emptyLockerboxes?.map((locker) => locker.label) ??
                              []
                            }
                            onChange={({ option }) => {
                              setLockerNumber(option)
                            }}
                            defaultValue={
                              emptyLockerboxes?.map(
                                (locker) => locker.label
                              )[0] ?? 1
                            }
                          />
                        </FormField>
                      </Box>
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
                        data-cy="submit-create-prescription-form"
                      />
                    </Box>
                  </Form>
                )}
              </Box>
            </Box>
          )}

          {
            /**
             * Show a Loading Modal when we are creating a prescription
             */
            isFetching && (
              <Box pad="xlarge" align="center" gap="medium" animation="fadeIn">
                <Text>Creating Prescription...</Text>
                <Spinner
                  size="xlarge"
                  border={false}
                  background="linear-gradient(to right, #fc466b, #683ffb)"
                />
              </Box>
            )
          }
        </Box>
      </Layer>
    )
  }

  return null
}