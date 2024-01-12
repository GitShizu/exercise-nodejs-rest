import express from "express"
import morgan from "morgan"
import path from "path"
import fs from "fs"

const app = express()

// Funk
const readResource = (resourceName) => {
    const filePath = `./databases/${resourceName}.json`
    const data = fs.readFileSync(path.resolve(filePath), { encoding: 'utf8' });
    const resource = JSON.parse(data);
    return resource;
}


const writeResource = (resourceName, newResource) => {
    const data = JSON.stringify(newResource);
    fs.writeFileSync(path.resolve(`./databases/${resourceName}.json`), data)
}

const generateId = (resourceName)=>{
    const resource = readResource(resourceName);
    const Ids = resource.map(a => a.id);
    for (let i = 0; i <= Ids.length; i++) {
        if (!Ids.includes(i)) {
            return i;
        }
    }
}

app.listen(3000, () => {
    console.log('Server listening - port 3000');
});

app.use(express.json()); //append body to response 
app.use(morgan('dev'));  //logger

// Read all authors
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./databases/authors.json'))
});

// Add author
app.post('/authors', (req, res) => {
    const newAuthor = req.body;
    let isAuthorValid = true;
    ['name', 'surname', 'birthdate', 'address'].forEach(propKey => {
        isAuthorValid &= newAuthor[propKey] !== undefined;
    });
    if (!isAuthorValid) {
        res.status(400).send('Author must include name, surname, birthdate and address')
        return;
    }
    const authors = readResource('authors');
    newAuthor.id = generateId('authors')
    authors.push(newAuthor);
    writeResource('authors', authors);
    res.send('Author added succesfully');
})