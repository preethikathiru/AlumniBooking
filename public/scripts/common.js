function handleFetchResponse(responseJson) {
    if(responseJson.status == 213){
        alert(responseJson.message);
        return true;
    }
}