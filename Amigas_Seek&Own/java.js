fetch('http://localhost:3000/properties', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        ID: 1, // Replace with the appropriate ID value if it's not auto-increment
        name: 'Property Name', 
        price: 100000, 
        location: 'Property Location' 
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to add property');
    }
    console.log('Property added successfully');
    // Handle successful response, e.g., reload property list
})
.catch(error => {
    console.error('Error adding property:', error.message);
});
