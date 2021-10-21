import "bulma"
import { Helmet } from "react-helmet"
import TopNav from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"
import React from "react"
import usePagination from "../hooks/usePagination"
import { saveAs } from "file-saver"


const Backgrounds = ({ match, location }) => {
  const [backgrounds, setBackgrounds] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, setPage, totalPages } = usePagination({
    contentPerPage: 12,
    count: backgrounds.length,
  })
  React.useEffect(() => {
    ;(async () => {
      try {
        const data = await axios.get(`${window.location.origin}/api/backgrounds${match.params.tag ? `?tag=${match.params.tag}` : ""}`)
        setBackgrounds(data.data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [match.params.tag])
  return (
    <div>
      <Helmet>
        <title>All Backgrounds | AmariBackgrounds</title>
      </Helmet>

      <TopNav />

      <div class="container">
        {loading ? (
          <p className="text-centered">Loading backgrounds data...</p>
        ) : error ? (
          <p className="has-text-danger text-centered">Failed to fetch background data</p>
        ) : (
          <>
            <div className="centerit">
              <p className="h3 centerit pb-3">{match.params.tag ? `${match.params.tag.charAt(0).toUpperCase() + match.params.tag.slice(1)} Backgrounds` : `All Backgrounds`}</p>

              <nav aria-label="Page Selector" className="pb-3">
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
            <div className="container items">
              <div class="row">
                {backgrounds.slice(firstContentIndex, lastContentIndex)?.map((el) => (
                  <ImageItem item={el} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

const ImageItem = (el) => {
  const downloadImage = () => {
    saveAs(el.item.url, "download.png") // Put your image url here.
  }

  const handleClick = () => {
    console.log("modal-" + el.item.name)
    $("modal" + el.item.name).modal("show")
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 centerit itemthing pt-3">
      {/* <p className="h5">{el.item.title || el.item.name}</p> */}
      <img onClick={handleClick} alt={el.item.title || el.item.name} src={el.item.url}></img>
      <div class="modal fade" id={"modal-" + el.item.name} tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{el.item.title || el.item.name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <img alt={el.item.title || el.item.name} src={el.item.url}></img>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button onClick={downloadImage} type="button" class="btn btn-primary">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Backgrounds
