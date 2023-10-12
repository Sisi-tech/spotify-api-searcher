import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "f964be6b70194af181b2bf917b84eb1c";
const CLIENT_SECRET = "b5d4084514884dfc90da22052d02186f";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))

  },[])

  // Search
  async function search() {
    // Get request using search to get the Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
  }

  return (
    <div className='app'>
        <div className="fixed-input-group">
          <InputGroup className="mb-3" size="lg">
              <FormControl
              placeholder="Search For Artist"
              type="input"
              onKeyDown={(event) => {
                if (event.key == "Enter") {
                  search();
                }
              }}
              onChange={(e)=>setSearchInput(e.target.value)}
              style={{ backgroundColor: 'rgb(230, 240, 255, 0.3)'}}
              />
              <Button onClick={search}
              style={{ 
                backgroundColor: 'pink',
                color: 'white',
                border: '1px solid white',
                borderRadius: '5px',
                padding: '10px 20px',
                frontSize: '16px',
                cursor: 'pointer',
              }}>
                Search
              </Button>
            </InputGroup>
        </div>
  
        <Container>
          <Row className="mx-1 row row-cols-4">
            {albums.map((album, index) => {
              return (
                <Card key={album.id} className="mb-3">
                <Card.Img src={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
              )
            })}
          </Row>
        </Container>
    </div>
  )
}

export default App
