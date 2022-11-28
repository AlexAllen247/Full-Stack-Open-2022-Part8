import { useQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

let authors

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  authors = result.data.allAuthors || []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthForm />
    </div>
  )
}

const BirthForm = () => {
  const [name, setName] = useState("")
  const [birth, setBirth] = useState("")
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, setBornTo: parseInt(birth) } })
    setName("")
    setBirth("")
  }

  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={handleSubmit}>
        <label>
          name
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}>
                {authors.map((author) => 
                    <option value={author.name}>{author.name}</option>
                )}
          </select>
        </label>
        <label>
          born
          <input
            type="number"
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </label>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default Authors
