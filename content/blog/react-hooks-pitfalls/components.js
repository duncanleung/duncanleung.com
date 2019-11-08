import React from 'react'
import {
  Router,
  createMemorySource,
  createHistory,
  Link,
  LocationProvider,
} from '@reach/router'
import {getDog, getDogs} from './dogs'

const source = createMemorySource('/')
const history = createHistory(source)

function DogList() {
  const [dogs, setDogs] = React.useState(null)
  React.useEffect(() => {
    getDogs().then(d => setDogs(d))
  }, [])
  if (!dogs) {
    return null
  }
  return (
    <div>
      <h1>Pick a dog</h1>
      <ul>
        {dogs.map(d => (
          <li key={d.id}>
            <Link to={d.id}>{d.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DogInfo({dogId, displayRelated, bug}) {
  const [dog, setDog] = React.useState(null)

  React.useEffect(() => {
    getDog(dogId).then(d => setDog(d))
    // only doing this for demo purposes!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bug ? null : dogId])

  if (!dog) {
    return null
  }

  return (
    <div>
      <h1>{dog.name}</h1>
      <img style={{height: 200}} alt={dog.name} src={dog.img} />
      <p>{dog.description}</p>
      <div>
        <label htmlFor="temperament">Temperament</label>
        <ul id="temperament">
          {dog.temperament.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      {displayRelated && dog.related.length ? (
        <div>
          <label htmlFor="related">Related Dogs</label>
          <ul id="related">
            {dog.related.map(r => (
              <li key={r.id}>
                <Link to={`/${r.id}`}>{r.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div>
        <Link to="/">Return to list</Link>
      </div>
    </div>
  )
}

function HiddenBugApp() {
  return (
    <Layout>
      <LocationProvider history={history}>
        <Router>
          <DogList path="/" />
          <DogInfo path="/:dogId" bug={true} />
        </Router>
      </LocationProvider>
    </Layout>
  )
}

function RevealedBugApp() {
  return (
    <Layout>
      <LocationProvider history={history}>
        <Router>
          <DogList path="/" />
          <DogInfo path="/:dogId" displayRelated={true} bug={true} />
        </Router>
      </LocationProvider>
    </Layout>
  )
}

function FixedBugApp() {
  return (
    <Layout>
      <LocationProvider history={history}>
        <Router>
          <DogList path="/" />
          <DogInfo path="/:dogId" displayRelated={true} />
        </Router>
      </LocationProvider>
    </Layout>
  )
}

function Layout(props) {
  return (
    <div
      style={{
        padding: 14,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        marginBottom: 20,
        minHeight: 900,
      }}
      {...props}
    />
  )
}

export {HiddenBugApp, RevealedBugApp, FixedBugApp}
