import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState({});
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const fetchAlbums = (userId) => {
    if (albums[userId]) {
      return;
    }

    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then((data) => {
        setAlbums((prevAlbums) => ({
          ...prevAlbums,
          [userId]: data,
        }));
      })
      .catch((error) => {
        setError(error);
      });
  };

  const fetchPhotos = (albumId) => {
    if (photos[albumId]) {
      return;
    }
    fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки");
        }
        return response.json();
      })
      .then((data) => {
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [albumId]: data,
        }));
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) return <p>Загрузка...</p>;
  if (error)
    return <p>Ошибка: {"Ошибка загузки,поверьте подключение к интернету"}</p>;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.name}</p>
            <button onClick={() => fetchAlbums(user.id)}>Album</button>
            {albums[user.id] && (
              <ul>
                {albums[user.id].map((album) => (
                  <li key={album.id}>
                    <p>{album.title}</p>
                    <button onClick={() => fetchPhotos(album.id)}>
                      Photos
                    </button>
                    {photos[album.id] && (
                      <ul>
                        {photos[album.id].map((photo) => (
                          <li key={photo.id}>
                            <img src={photo.thumbnailUrl} alt={photo.title} />
                            <p>{photo.title}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
