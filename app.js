const express = require("express")
const app = express()

app.get('/', (req, res) => {
    res.send("Home Page")
})

app.listen(3000, () => {
    console.log('server is listening on port 3000...')
})

// app.get 
// app.post 
// app.put 
// app.delete 
// app.all 
// app.user
// app.listen