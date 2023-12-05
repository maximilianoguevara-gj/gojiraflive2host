import axios from 'axios'

const { REACT_APP_USERS_MICROSERVICE_URL } = process.env
const INSERT_USER_DATA = `mutation InsertEventUserOne($event_id: String = "", $email: citext = "", $name: String = "", $store_id: String = "") {
  insert_event_user_one(object: {event: {data: {external_id: $event_id, store: {data: {external_id: $store_id}, on_conflict: {constraint: stores_external_id_key, update_columns: external_id}}}, on_conflict: {constraint: events_external_id_key, update_columns: external_id}}, user: {data: {email: $email, name: $name}, on_conflict: {constraint: users_email_key, update_columns: name}}}, on_conflict: {constraint: event_user_event_id_user_id_key}) {
    event {
      external_id
      store {
        external_id
      }
    }
    user {
      id
    }
  }
}`
const headers = {
  'Content-Type': 'application/json',
}

export const sendUserData = async ({ event_id, store_id, email, name }) => {
  const response = await axios({
    url: `${REACT_APP_USERS_MICROSERVICE_URL}/v1/graphql`,
    method: 'post',
    data: JSON.stringify({
      query: INSERT_USER_DATA,
      variables: {
        event_id,
        store_id,
        email,
        name,
      },
    }),
    headers: headers,
  })

  return response
}
