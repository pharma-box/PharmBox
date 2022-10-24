import { Box } from 'grommet'
import { PropsWithChildren } from 'react'
import Sidebar from './Sidebar'
import { User } from '../types/types'
import Protector from './Protector'
import PageErrorBoundary from './PageErrorBoundary'
import Navbar from './Navbar'

export default function Page({
  user,
  children
}: PropsWithChildren<{ user: User }>) {
  return (
    <Box direction="column" fill>
      <Navbar />
      <Box direction="row" fill>
        <Sidebar role={user.role} />
        <PageErrorBoundary>
          <Protector role={user.role}>{children}</Protector>
        </PageErrorBoundary>
      </Box>
    </Box>
  )
}
