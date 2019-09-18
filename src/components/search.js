import React from "react"
import * as JsSearch from "js-search"

class Search extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      engine: null,
      searchResults: [],
      searchQuery: "",
      mainCount: 0,
      extraCount: 0,
      mainFullList: this.bucketFilter(props.apps, "main"),
      extraFullList: this.bucketFilter(props.apps, "extra")
    }
  }

  componentDidMount() {
    this.initSearchEngine()
  }

  bucketFilter = (apps, bucket) => {
    return apps.filter(app => app.bucket === bucket)
  }

  initSearchEngine = () => {
    const engine = new JsSearch.Search("name")
    engine.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()
    engine.addIndex("name")
    engine.addDocuments(this.props.apps)
    this.setState({ engine: engine })
  }

  searchApps = e => {
    const { engine } = this.state
    const queryResults = engine.search(e.target.value)
    this.setState({
      searchQuery: e.target.value,
      searchResults: queryResults,
      mainCount: this.bucketFilter(queryResults, "main").length,
      extraCount: this.bucketFilter(queryResults, "extra").length,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
  }

  randomPicks = () => {
    const mainPick = this.state.mainFullList[
      Math.floor(Math.random() * this.state.mainFullList.length)
    ]
    const extraPick = this.state.extraFullList[
      Math.floor(Math.random() * this.state.extraFullList.length)
    ]
    return [mainPick, extraPick]
  }

  render() {
    const { searchResults, searchQuery } = this.state
    const queryResults = searchQuery === "" ? this.randomPicks() : searchResults
    return (
      <React.Fragment>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div style={{ margin: "0 auto" }}>
              <input
                id="search"
                value={searchQuery}
                onChange={this.searchApps}
                style={{ margin: "0 auto", width: "400px" }}
              />
            </div>
          </form>
        </div>
        <div>
          {searchQuery === "" ? `Random Picks` : `Search Result`}
          <span>{`Main: ${searchQuery === "" ? 1 : this.state.mainCount}`}</span>
          <span>{`Extra: ${searchQuery === "" ? 1 : this.state.extraCount}`}</span>
        </div>
        <ul>
          {queryResults.map(app => {
            return <li key={app.name}>{app.name}</li>
          })}
        </ul>
      </React.Fragment>
    )
  }
}

export default Search
