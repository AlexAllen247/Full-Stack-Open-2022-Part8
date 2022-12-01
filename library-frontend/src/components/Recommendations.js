import { useEffect, useState } from "react"
import { USER, ALL_BOOKS } from "../queries"
import { useQuery, useLazyQuery } from "@apollo/client"

const Recommendations = (props) => {
  const user = useQuery(USER)
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [books, setBooks] = useState([])
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache",
  })

  useEffect(() => {
    if (user.data) {
      setFavoriteGenre(user?.data?.me?.favoriteGenre)
      getBooks({ variables: { genre: favoriteGenre } })
    }
  }, [user.data, favoriteGenre, getBooks])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (result.loading || user.loading) {
    return <p>Loading...</p>
  }

  if (result.error || user.error) {
    return <p>Error!</p>
  }


  return (
    <div>
      <h2>Recommendations</h2>
      Books in your favourite genre <b>{favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book, i) => (
            <tr key={i}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
