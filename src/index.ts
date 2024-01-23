import {app} from "./settings";
import {runDB} from "./db/db";


const port = process.env.PORT || 3000

app.listen(port,async ()=>{
    await runDB()
    console.log(`App start on port ${port}`)
})