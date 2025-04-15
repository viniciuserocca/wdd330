export function getCurrentPosition(){
    
    function successCallback(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function errorCallback(error) {
        console.error(`Error getting location: ${error.message}`);
    }

    const options = {
        enableHighAccuracy: true, 
        timeout: 5000,            
        maximumAge: 0             
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
}