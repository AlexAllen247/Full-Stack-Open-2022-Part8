import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_BOOKS_GENRES } from "../queries"
import { useState, useEffect } from "react"

const Books = ({ show }) => {
  const [books, setBooks] = useState(null)
  const [genreFilter, setGenreFilter] = useState(null)
  const genres = useQuery(ALL_BOOKS_GENRES)
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: genreFilter,
    },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const allGenres = genres.data.allBooks.flatMap((book) => book.genres)
  const individualGenres = [...new Set(allGenres)]
  const switchFilter = (value) => {
    setGenreFilter(value)
    genres.refetch({ query: ALL_BOOKS_GENRES })
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form>
        {individualGenres.map((genre) => (
          <label key={genre}>
            <input
              type="radio"
              value={genre}
              name="genre-filter"
              onChange={({ target }) => switchFilter(target.value)}
            />
            {genre}
          </label>
        ))}
        <label>
          <input
            type="radio"
            key="all"
            value="all"
            name="genre-filter"
            defaultChecked={true}
            onChange={() => switchFilter(null)}
          />
          all genres
        </label>
      </form>
    </div>
  )
}

export default Books
