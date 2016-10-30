var tdMatrixParser=new TDMATRIX();

var documents=tdMatrixParser.ExtractDocuments(["I love football.","Football is my love"]);

tdMatrixParser.TFIDf(documents,0);

console.log("Distance between the two documents is "+tdMatrixParser.GetDistance(documents[0],documents[1]));
