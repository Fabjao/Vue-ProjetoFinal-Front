import apollo, { onLogin } from '@/plugins/apollo'
import LoginMutation from '@/modules/auth/graphql/Login.gql'
import SignUpMutation from '@/modules/auth/graphql/SignUp.gql'
import UserQuery from '@/modules/auth/graphql/User.gql'

const login = async variables => {
  const response = await apollo.mutate({
    mutation: LoginMutation,
    variables
  })

  const { login } = response.data
  await onLogin(apollo, login.token)
  return login
}

const signup = async variables => {
  const response = await apollo.mutate({
    mutation: SignUpMutation,
    variables
  })
  console.log('signup: ', response.data)
  const { signup } = response.data
  await onLogin(apollo, signup.token)
  return signup
}

const user = async (options = {}) => {
  const response = await apollo.query({
    query: UserQuery,
    ...options
  })
  return response.data.user
}

export default {
  login,
  signup,
  user
}
