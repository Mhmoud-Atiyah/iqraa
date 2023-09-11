/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
function getData(path) {
    let obj = fetch(`http://localhost:1999/${path}`, {
        //TODO: Set some flags to gurantee Security
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};