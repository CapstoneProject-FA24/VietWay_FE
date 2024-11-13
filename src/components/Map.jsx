import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_LIBRARIES, DEFAULT_MAP_OPTIONS, DEFAULT_CENTER } from '@config/mapConfig';

const infoWindowStyle = `
  .gm-style .gm-style-iw-c {
    padding: 15px !important;
    border-radius: 10px !important;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.3) !important;
    background-color: white !important;
    width: 400px !important;
  }

  .gm-style .gm-style-iw-d {
    overflow: hidden !important;
    padding: 0 !important;
  }
  
  .gm-style .transit-container .gm-title {
    font-size: 18px !important;
    width: 100% !important;
  }

  .address {
    display: flex;
    flex-wrap: wrap;
  }

  .address-line {
    width: fit-content !important;
  }

  .address-line:not(:last-child)::after {
    content: ",\\00A0";
  }

  .gm-style .gm-style-iw-c div {
    color: #333333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const autocompleteStyle = `
  /* Main dropdown container */
  .pac-container {
    border-radius: 10px;
    margin-top: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  /* Individual result items */
  .pac-item {
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
  }

  /* Hover state for items */
  .pac-item:hover {
    background-color: #f5f5f5;
  }

  /* The matched text in results */
  .pac-item-query {
    font-size: 14px;
    color: #333333;
  }

  /* Secondary text (location) */
  .pac-secondary-query {
    font-size: 13px;
    color: #666666;
  }

  /* Icons in the results */
  .pac-icon {
    margin-top: 5px;
  }

  /* Remove the default Google logo */
  .pac-logo:after {
    display: none;
  }

  #pac-input{
    left: 0 !important;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

function Map({ placeId }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const [map, setMap] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [marker, setMarker] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [buttonContainer, setButtonContainer] = useState(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

    const onLoad = useCallback((map) => {
        const placesService = new window.google.maps.places.PlacesService(map);

        // Function to handle place selection and marker placement
        const handlePlaceSelection = (place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create marker with all necessary data
            const newMarker = {
                position: place.geometry.location,
                title: place.name,
                geometry: place.geometry,
                name: place.name,
                address_components: place.address_components,
                place_id: place.place_id
            };

            setMarker(newMarker);
            setSelectedPlace(newMarker);

            // Center map on the location
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
        };

        // Initialize search box
        const searchBox = new window.google.maps.places.Autocomplete(
            document.getElementById("pac-input"),
            {
                types: ['establishment', 'geocode'],
                fields: ["place_id", "geometry", "formatted_address", "name", "address_components"]
            }
        );

        map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
            document.getElementById("pac-input")
        );

        searchBox.bindTo('bounds', map);
        setSearchBox(searchBox);

        searchBox.addListener("place_changed", () => {
            const place = searchBox.getPlace();
            handlePlaceSelection(place);
        });

        // If placeId is provided, fetch and display the place
        if (placeId) {
            const request = {
                placeId: placeId,
                fields: ["place_id", "geometry", "formatted_address", "name", "address_components"]
            };

            placesService.getDetails(request, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    handlePlaceSelection(place);
                } else {
                    console.error("Place details request failed:", status);
                }
            });
        }

        // Update searchNearbyPlaces to use current map center
        const searchNearbyPlaces = (type) => {
            const currentCenter = map.getCenter();
            const request = {
                location: currentCenter,
                radius: 5000, // 5km radius
                type: type
            };

            placesService.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setNearbyPlaces(results.map(place => ({
                        position: place.geometry.location,
                        title: place.name,
                        name: place.name,
                        place_id: place.place_id,
                        rating: place.rating,
                        address: place.vicinity
                    })));
                }
            });
        };

        // Add buttons for nearby search
        const createSearchButton = (type, label) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.style.margin = '10px';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '20px';
            button.style.border = 'none';
            button.style.backgroundColor = '#fff';
            button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                searchNearbyPlaces(type);
            });

            return button;
        };

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.appendChild(createSearchButton('museum', 'Bảo tàng'));
        buttonContainer.appendChild(createSearchButton('restaurant', 'Nhà hàng'));
        buttonContainer.appendChild(createSearchButton('tourist_attraction', 'Điểm tham quan'));

        // Add button container to map controls
        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(buttonContainer);
        setButtonContainer(buttonContainer);

        setMap(map);
    }, [placeId]);

    const onUnmount = useCallback(() => {
        if (map && buttonContainer) {
            // Remove the button container from map controls
            const index = map.controls[window.google.maps.ControlPosition.TOP_CENTER].getArray().indexOf(buttonContainer);
            if (index !== -1) {
                map.controls[window.google.maps.ControlPosition.TOP_CENTER].removeAt(index);
            }
        }
        setMap(null);
        setButtonContainer(null);
    }, [map, buttonContainer]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (map && buttonContainer) {
                const index = map.controls[window.google.maps.ControlPosition.TOP_CENTER].getArray().indexOf(buttonContainer);
                if (index !== -1) {
                    map.controls[window.google.maps.ControlPosition.TOP_CENTER].removeAt(index);
                }
            }
        };
    }, [map, buttonContainer]);

    // Add onCenterChanged handler
    const onCenterChanged = () => {
        if (map) {
            setMapCenter(map.getCenter());
        }
    };

    return isLoaded ? (
        <>
            <style>{infoWindowStyle}</style>
            <style>{autocompleteStyle}</style>
            <label>
                <input
                    id="pac-input"
                    className="map-search-box"
                    type="text"
                    placeholder="Tìm điểm đến..."
                    style={{
                        marginTop: "10px",
                        marginLeft: "10px",
                        width: "350px",
                        height: "45px",
                        padding: "0 20px",
                        border: "none",
                        borderRadius: "100px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                        fontSize: "14px",
                        outline: "none",
                        textOverflow: "ellipsis",
                    }}
                />
            </label>
            <GoogleMap
                mapContainerStyle={DEFAULT_MAP_OPTIONS}
                center={DEFAULT_CENTER}
                zoom={6}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onCenterChanged={onCenterChanged}
                options={{
                    mapTypeControlOptions: {
                        position: window.google.maps.ControlPosition.BOTTOM_LEFT
                    }
                }}
            >
                {marker && (
                    <Marker
                        position={marker.position}
                        title={marker.title}
                        onClick={() => setSelectedPlace(marker)}
                    />
                )}
                {nearbyPlaces.map((place, index) => (
                    <Marker
                        key={`${place.place_id}-${index}`}
                        position={place.position}
                        title={place.name}
                        onClick={() => setSelectedPlace({
                            ...place,
                            address_components: [{ long_name: place.address }]
                        })}
                    />
                ))}
                {selectedPlace && selectedPlace.position && (
                    <InfoWindow
                        position={selectedPlace.position}
                        onCloseClick={() => setSelectedPlace(null)}
                    >
                        <div>
                            <div className="transit-container">
                                <div className="gm-title">{selectedPlace.name}</div>
                            </div>
                            <div className="address">
                                {selectedPlace.address_components?.map((component, index) => (
                                    <span key={index} className="address-line">
                                        {component.long_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    ) : <></>;
}

export default Map;