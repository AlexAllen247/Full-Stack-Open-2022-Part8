import { useEffect, useState } from "react"
import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client"

const Recommendations = ({ currentUser, show }) => {
  const [favouriteGenre, setFavouriteGenre] = useState(null)

  useEffect(() => {
    if (currentUser && currentUser.me !== null) {
      setFavouriteGenre(currentUser.me.favouriteGenre)
    }
  }, [currentUser])

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: favouriteGenre },
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    ;<div>loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      books in your favourite genre <b>{favouriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
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
