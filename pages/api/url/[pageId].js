import { MongoClient } from "mongodb";

const UrlPage = async (req, res) => {
  const connectionString = `mongodb+srv://${process.env.mongodb_name}:${process.env.mongodb_pass}@${process.env.mongodb_cluster}.hnaps.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
  try {
    const client = await MongoClient.connect(connectionString);

    if (req.method === "POST") {
      const urlId = req.body.pageId;
      const redirect = {
        _id: req.body.id,
        urlId: req.body.id,
        redirectTo: req.body.url,
      };

      const db = client.db();
      try {
        const result = await db.collection("pages").insertOne(redirect);
        res
          .status(200)
          .json({ message: "Url has been added successfully", url: redirect });
      } catch (error) {
        res.status(401).json({
          message: "URL ID is already taken, please choose another one",
        });
      }
    }
    if (req.method === "GET") {
      const urlId = req.query.pageId;
      const db = client.db();
      const documents = await db
        .collection("pages")
        .find({ urlId: urlId })
        .toArray();

      res.status(200).json({ message: "Recieved Url", document: documents });
    }

    client.close();
  } catch (error) {
    console.log(error);
  }
};

export default UrlPage;
