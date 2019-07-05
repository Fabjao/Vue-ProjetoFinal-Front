import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import AccountsQuery from './../graphql/Accounts.gql'
import AccountCreateMutation from './../graphql/AccountCreate.gql'
import { fromPromise } from 'apollo-link'

const accounts = () => {
  const queryRef = apollo.watchQuery({
    query: AccountsQuery
  })
  return from(queryRef)
    .pipe(
      map(res => res.data.accounts)
    )
}

const createAccount = async variables => {
  const response = await apollo.mutate({
    mutation: AccountCreateMutation,
    variables,
    update: (proxy, { data: { createAccount } }) => {
      try {
        const data = proxy.readQuery({
          query: AccountsQuery
        })
        data.accounts = [...data.accounts, createAccount]
        proxy.writeQuery({
          query: AccountsQuery,
          data
        })
      } catch (error) {
        console.log('Query "accounts" has not benn read yet!', error)
      }
    }
  })
  return response.data.createAccount
}

export default {
  accounts,
  createAccount
}
