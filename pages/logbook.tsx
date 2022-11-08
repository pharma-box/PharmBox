import Head from 'next/head'
import { Box, Header, Text } from 'grommet'
import Lottie from 'lottie-react'
import constructionAnimation from '../public/assets/construction.json'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import Breadcrumbs from '../components/Breadcrumbs'

const Logbook = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox | Logbook</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box
          animation="fadeIn"
          direction="column"
          align="start"
          fill
          className="logbook"
        >
          <Breadcrumbs pages={['Logbook']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" basis="auto" fill="horizontal" gap="medium">
              <Header>
                <Text>
                  <Text weight="bolder">Coming Soon:</Text> Presciption Pickup
                  History
                </Text>
              </Header>
              <Box pad="large">
                <Lottie
                  animationData={constructionAnimation}
                  style={{ height: '100%' }}
                  autoPlay
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default Logbook

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
