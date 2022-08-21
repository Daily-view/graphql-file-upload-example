import React from 'react';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import {ApolloClient} from "apollo-client"
import {ApolloProvider} from "react-apollo"
import gql from "graphql-tag"
import { Mutation } from "react-apollo"

const apolloCache = new InMemoryCache()

const uploadLink = createUploadLink({
  uri: 'http://localhost:9000/graphql',
  headers: {
    "keep-alive": "true",
    "Content-Type": "application/json"
  }
})

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink
})

const fileUpload = ({target: { files }}) => {
  const file = files[0]
  console.log(file)
}

const UPLOAD_FILE = gql`
    mutation uploadFile($input: Upload!) {
    uploadFile(input: input)
    }
`;


function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <header className="App-header">
          <h2>Save Local</h2>
          <Mutation mutation={UPLOAD_FILE}>
            {(singleUpload, { data, loading }) => {
              console.log(data)
              return (<form onSubmit={fileUpload} encType={'multipart/form-data'}>
                <input name={'document'} type={'file'} onChange={({target: { files }}) => {
                  const file = files[0]
                  file && singleUpload({ variables: { file: file } })
                }}/>
                {loading && <p>Loading.....</p>}
              </form>)
            }
            }
          </Mutation>
          <h2>Stream to Server</h2>
        </header>
      </ApolloProvider>
    </div>
  );
}

export default App;