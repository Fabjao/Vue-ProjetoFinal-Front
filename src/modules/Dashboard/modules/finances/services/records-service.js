import apollo from '@/plugins/apollo'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import md5 from 'md5'

import RecordCreateMutation from './../graphql/RecordCreate.gql'
import RecordsQuery from './../graphql/Records.gql'
import TotalBalanceQuery from './../graphql/TotalBalance.gql'

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      const month = moment(createRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }
      // Records
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })
        recordsData.records = [...recordsData.records, createRecord]
        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (error) {
        console.log('Query "records" has not been read yet!', error)
      }

      // Total Balance
      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(createRecord.date.substr(0.10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceDate = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })
          console.log('Conteudo totalBalance', totalBalanceDate)
          totalBalanceDate.totalBalance = +(totalBalanceDate.totalBalance + createRecord.amount).toFixed(2)

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceDate
          })
        }
      } catch (error) {
        console.log('Query "totalBalance" has not been read yet!', error)
      }
    }
  })
  return response.data.createRecord
}

const recordsWatchedQueries = {}

const records = variables => {
  const haskey = md5(Object
    .keys(variables)
    .map(k => variables[k]).join('_'))

  let queryRef = recordsWatchedQueries[haskey]
  if (!queryRef) {
    queryRef = apollo.watchQuery({
      query: RecordsQuery,
      variables
    })
    recordsWatchedQueries[haskey] = queryRef
  }

  return from(queryRef)
    .pipe(
      map(res => res.data.records)
    )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  console.log('total balance ', response.data)
  return response.data.totalBalance
}

export default {
  createRecord,
  records,
  totalBalance
}
