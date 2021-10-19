import "bulma"
import { Helmet } from "react-helmet"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"
import React from "react"
import usePagination from "../hooks/usePagination"

const Backgrounds = ({ match, location }) => {
  console.log(match, location)
  const [backgrounds, setBackgrounds] = React.useState([])
  const [activeTag, setActiveTag] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, setPage, totalPages } = usePagination({
    contentPerPage: 10,
    count: backgrounds.length,
  })
  React.useEffect(() => {
    ;(async () => {
      try {
        console.log(`${window.location.origin}/api/backgrounds${match.params.tag ? `?tag=${match.params.tag}` : ""}`)
        const data = await axios.get(`${window.location.origin}/api/backgrounds${match.params.tag ? `?tag=${match.params.tag}` : ""}`)
        const data2 = await axios.get(`${window.location.origin}/api/tags`)
        setBackgrounds(data.data)
        setTags(data2.data)
        console.log(data2)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  return (
    <div>
      <Helmet>
        <title>All Backgrounds | AmariBackgrounds</title>
      </Helmet>

      <Navbar />

      <div className="container">
        {loading ? (
          <p className="text-centered">Loading backgrounds data...</p>
        ) : error ? (
          <p className="has-text-danger text-centered">Failed to fetch background data</p>
        ) : (
          <>
            <div className="centerit">
              {/* eslint-disable-next-line */}
              <a href="/backgrounds" onClick={() => setActiveTag(null)} className={"button"}>
                View All
              </a>
              {console.log(tags, activeTag)}
              {tags.map((x) => (
                /* eslint-disable-next-line */
                <a href={`/backgrounds/${x}`} onClick={() => setActiveTag(x)} className={"button"}>
                  {x}
                </a>
              ))}
              <p className="text">
                {page}/{totalPages}
              </p>

              <nav aria-label="Page Selector">
                <ul class="pagination" style={{ justifyContent: "center" }}>
                  <li class="page-item">
                    {/* eslint-disable-next-line */}
                    <a aria-label="Previous" href="#" onClick={prevPage} className={"page-link is-amariYellow"}>
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  {[...Array(totalPages).keys()].map((el) => (
                    <li class="page-item">
                      {/* eslint-disable-next-line */}
                      <a onClick={() => setPage(el + 1)} key={el} className={`page ${page === el + 1 ? "active" : ""} page-link is-amariYellow`} href="#">
                        {el + 1}
                      </a>
                    </li>
                  ))}
                  <li class="page-item">
                    {/* eslint-disable-next-line */}
                    <a aria-label="Next" href="#" onClick={nextPage} className={"page-link is-amariYellow"}>
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="items">
              {console.log(backgrounds, activeTag)}
              {backgrounds
                .slice(firstContentIndex, lastContentIndex)
                ?.map((el) => (
                  <div>
                    <p>{el.name}</p>
                    <img alt={el.name} src={el.url}></img>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Backgrounds
