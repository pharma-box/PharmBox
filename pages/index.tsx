import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import getUserDetails from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Text } from 'grommet'
const Home = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Homepage. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box pad="medium">
          <Text>Hello {user.first_name}</Text>
          <Text>You are a {user.role}</Text>
          <Text>Your Email is: {user.email}</Text>
        </Box>
      </Page>
    </>
  )
}

export default Home

export const getServerSideProps = withServerSideAuth(
  async ({ req }) => {
    const { userId } = req.auth
    if (userId) {
      return getUserDetails(userId)
    }
    return { props: { userId } }
  },
  { loadUser: true }
)
