import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, List } from "antd";

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchState, setSearchState] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [local, setLocal] = useState();

  useEffect(() => {
    const loadMapScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://webapi.amap.com/maps?v=1.4.15&key=fdc53ab09ba9afc564504872015c6ae4";
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initMap = () => {
      const map = new window.AMap.Map(mapContainerRef.current, {
        zoom: 13,
        center: [116.397428, 39.90923],
      });

      setMap(map);
    };

    loadMapScript().then(initMap);
  }, []);

  useEffect(() => {
    if (!map || !searchState) return;

    const options = {
      city: "全国",
      citylimit: true,
      keywords: searchKeyword,
      pageSize: 10,
      pageIndex: 1,
    };

    map.plugin("AMap.PlaceSearch", function () {
      const placeSearch = new window.AMap.PlaceSearch(options);
      placeSearch.search(options.keywords, function (status, result) {
        if (status === "complete") {
          setSearchState(false);
          setSearchResult(result);
        }
      });
    });
  }, [searchKeyword, searchState]);

  useEffect(() => {
    if (local) {
      new window.AMap.Marker({
        position: [local?.location?.lng, local?.location?.lat],
        map: map,
      });
      setSearchKeyword(local?.name);
      map.setCenter([local?.location?.lng, local?.location?.lat]);
      setSearchResult(null);
    }
  }, [local, setSearchResult]);

  return (
    <div>
      <div
        style={{
          height: "100px",
          width: "100%",
          position: "absolute",
          zIndex: 999,
        }}
      >
        <Input
          type="text"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setSearchState(true);
          }}
          placeholder="搜索地点"
        />

        {searchResult && (
          <List
            style={{ backgroundColor: "#fff999" }}
            size="small"
            bordered
            dataSource={searchResult?.poiList?.pois}
            renderItem={(poi) => (
              <List.Item key={poi.id}>
                <Button onClick={() => setLocal(poi)} type="link">
                  {poi.name}
                </Button>
              </List.Item>
            )}
          />
        )}
      </div>
      <div
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
    </div>
  );
};

export default MapPage;
