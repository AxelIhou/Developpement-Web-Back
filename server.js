const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const { request } = require('http');

const uri = "mongodb+srv://Axel_Ih:test@mycluster.kwz64yb.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use((req,res,next) => {
    console.log(`Requête reçue: ${request.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
})


const client = new MongoClient(uri);
    client.connect(err => {
    if(err){
        console.log("Erreur à la connexion à la base de données");
    } else {
        console.log("Connexion réussie");
    }
});

app.post('/utilisateurs', (request, response) =>{
    const {nom, prenom} = request.body;
    if(!nom || !prenom){
        return response.status(400).json({ erreur : "Veuillez fournir un nom et un prénom"});
    }

    const newUser = {nom, prenom};
    const collection = client.db("myDb").collection("utilisateur");

    try{
        const result = collection.insertOne(newUser);
        console.log("Utilisateur ajouté avec succès")
        response.status(201).json(newUser)
    }
    catch (error){
        console.error("Erreur lors de l'ajout de l'utilisateur")
        response.status(500).json({erreur : "Erreur lors de l'ajout d'utilisateur"})
    }

});

app.delete('/utilisateurs/:id', (req, res) =>{

})


app.get ('/utilisateurs', (request, response) => {
    const collection = client.db("myDb").collection('utilisateur');
    collection.find().toArray((err, utilisateurs) => {
        if(err){
            console.error('Erreur lors de la recherche des utilisaturs: ', error);
            response.status(500).send("Erreur interne du serveur");
        }
        else {
            response.json(utilisateurs);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Serveur en cours d'execution sur le port : ${port}`)
});
