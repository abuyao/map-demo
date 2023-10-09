import React, { useState, useEffect } from "react";
import { Map, Marker } from "react-amap";

const MapPage = () => {
  const [center, setCenter] = useState({ longitude: 0, latitude: 0 });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // 根据关键字搜索地点
    if (keyword) {
      const search = new window.AMap.PlaceSearch();
      search.search(keyword, (status, result) => {
        if (status === "complete" && result.info === "OK") {
          setSearchResults(result.poiList.pois);
        } else {
          setSearchResults([]);
        }
      });
    } else {
      setSearchResults([]);
    }
  }, [keyword]);

  const handleSelectLocation = (location) => {
    setCenter({
      longitude: location.location.lng,
      latitude: location.location.lat,
    });
    setSelectedLocation(location);
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="请输入地名"
      />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((location) => (
            <li
              key={location.id}
              onClick={() => handleSelectLocation(location)}
            >
              {location.name}
            </li>
          ))}
        </ul>
      )}
      <Map center={center}>
        {selectedLocation && <Marker position={selectedLocation.location} />}
      </Map>
    </div>
  );
};

export default MapPage;
