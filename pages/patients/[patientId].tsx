import Head from 'next/head'
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Header,
  Layer,
  Menu,
  Text
} from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import Breadcrumbs from '../../components/Breadcrumbs'
import { useRouter } from 'next/router'
import usePatient from '../../hooks/patient'
import { formatPhoneNumber } from '../../helpers/validators'
import theme from '../../styles/theme'
import {
  Close,
  Edit,
  OverflowMenuHorizontal,
  TrashCan
} from '@carbon/icons-react'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtom } from 'jotai'
import { addPatientModalState } from '../../components/AddPatientModal'

const PatientPage = ({ user: currentUser }: ServerPageProps) => {
  const router = useRouter()
  const { patientId } = router.query
  const [, setShowAddPatientModal] = useAtom(addPatientModalState)

  // cast to string to be safe
  const { patient, error, isLoading, updatePickup, deletePatient } = usePatient(
    `${patientId}`
  )

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  async function handleDeletePatient() {
    const deleted = await deletePatient()
    if (deleted) {
      setShowDeleteModal(false)
      router.push('/patients')
    }
  }

  let patientFirstName: string | undefined
  let patientLastName: string | undefined
  let patientEmail: string | undefined
  let patientPhoneNumber: string | undefined
  let patientFullName: string | undefined
  let patientPickupEnabled: boolean = false

  if (isLoading) {
    return (
      <Box pad="medium">
        <Skeleton count={2} />
      </Box>
    )
  }

  if (patient && !error) {
    const { User, pickupEnabled } = patient
    patientFirstName = User?.firstName ?? '...'
    patientLastName = User?.lastName ?? '...'
    patientEmail = User?.email ?? '...@...'
    patientPhoneNumber = User?.phoneNumber ?? '(...) ... ...'
    patientPickupEnabled = pickupEnabled
    patientFullName = `${patientFirstName} ${patientLastName}` ?? '... ...'

    return (
      <>
        {showDeleteModal && (
          <Layer
            onEsc={() => setShowDeleteModal(false)}
            onClickOutside={() => setShowDeleteModal(false)}
          >
            <Box pad="medium">
              <>
                <Box flex={false} direction="row" justify="between">
                  <Box pad="small">
                    <Text size="medium" weight="bold">
                      Delete Patient
                    </Text>
                  </Box>
                  <Button
                    icon={<Close size={16} />}
                    onClick={() => setShowDeleteModal(false)}
                  />
                </Box>
                <Box pad="small" gap="medium">
                  <Text size="small">
                    Delete <b>{patientFullName}</b> from PharmaBox? This action
                    cannot be undone.
                  </Text>
                  <Box
                    flex={false}
                    direction="row"
                    justify="between"
                    gap="medium"
                  >
                    <Button
                      label="Cancel"
                      size="small"
                      onClick={() => setShowDeleteModal(false)}
                    />
                    <Button
                      label={`Remove ${patientFullName}`}
                      primary
                      size="small"
                      color={theme.global.colors['status-critical']}
                      onClick={handleDeletePatient}
                    />
                  </Box>
                </Box>
              </>
            </Box>
          </Layer>
        )}
        <Head>
          <title>Patients | {patientFullName}</title>
          <meta
            name="description"
            content="Pharmabox Notifications. Login to continue"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Page user={currentUser}>
          <Box
            animation="fadeIn"
            direction="column"
            align="start"
            className="Settings"
            fill="horizontal"
          >
            <Box basis="auto" fill="horizontal">
              <Header>
                <Box>
                  <Breadcrumbs pages={['Patients', `${patientFullName}`]} />
                </Box>
                <Box pad={{ right: 'medium' }}>
                  <Menu
                    dropProps={{
                      align: { top: 'bottom', right: 'left' },
                      round: 'small'
                    }}
                    size="small"
                    items={[
                      {
                        label: <Text size="small">Edit Patient</Text>,
                        icon: <Edit size={20} />,
                        gap: 'small'
                      },
                      {
                        label: (
                          <Text
                            size="small"
                            color={theme.global.colors['status-critical']}
                          >
                            Delete Patient
                          </Text>
                        ),
                        icon: (
                          <TrashCan
                            size={20}
                            color={theme.global.colors['status-critical']}
                          />
                        ),
                        gap: 'small',
                        onClick: () => setShowDeleteModal(true)
                      }
                    ]}
                    icon={<OverflowMenuHorizontal size={24} />}
                  />
                </Box>
              </Header>
              <Box pad="medium">
                <Box
                  direction="row"
                  border
                  pad="medium"
                  round="small"
                  flex="grow"
                  gap="large"
                  alignContent="between"
                >
                  <Box direction="column" gap="small">
                    <Text size="xsmall">First Name:</Text>
                    <Text size="small">{patientFirstName}</Text>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Last Name:</Text>
                    <Text size="small">{patientLastName}</Text>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Email</Text>
                    <Anchor
                      weight="normal"
                      target="_blank"
                      href={`mailto:${patientEmail}`}
                      size="small"
                    >
                      {patientEmail}
                    </Anchor>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Phone Number</Text>
                    <Anchor
                      weight="normal"
                      target="_blank"
                      href={`tel:${patientPhoneNumber}`}
                      size="small"
                    >
                      {formatPhoneNumber(`${patientPhoneNumber}`)}
                    </Anchor>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">
                      Pickup Status{' '}
                      {!patientPickupEnabled && (
                        <Text
                          size="xsmall"
                          color={theme.global.colors['status-error']}
                        >
                          Off
                        </Text>
                      )}
                    </Text>
                    <CheckBox
                      toggle
                      label="Pickup Enabled"
                      checked={patientPickupEnabled}
                      onChange={(event) =>
                        updatePickup({
                          pickupEnabled: event.target.checked
                        })
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Page>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Patients | Not Found</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={currentUser}>
        <Box
          animation="fadeIn"
          direction="column"
          align="start"
          className="Settings"
          fill="horizontal"
        >
          <Box basis="auto" fill="horizontal">
            <Header>
              <Box>
                <Breadcrumbs pages={['Patients', 'Not Found']} />
              </Box>
            </Header>
            <Box pad="medium">
              <Box
                direction="column"
                border
                pad="medium"
                round="small"
                align="center"
                gap="medium"
              >
                <Text size="small">
                  The patient you are looking for does not exist in the
                  Pharmabox Database.
                </Text>
                <Box width="medium">
                  <Button
                    label="Add New Patient"
                    primary
                    size="small"
                    fill={false}
                    onClick={() => setShowAddPatientModal(true)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default PatientPage

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
