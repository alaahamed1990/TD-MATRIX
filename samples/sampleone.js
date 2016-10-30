var tdMatrixParser=new TDMATRIX();

var sentences=tdMatrixParser.ExtractSentences("I love football.Football is my love");

tdMatrixParser.NormlizeTermsFrequency(sentences);


//Passing sentences and minimum thrshold for distance on which our disjint set will be calculated
var sentenceSet=tdMatrixParser.ExtractDisjointSet(sentences,.5);

for(var index in sentences)
{
  var setIndex=sentenceSet.parent[index];

  console.log(sentences[index].value);

  console.log("Current sentence set is "+setIndex);


  //this can be used in suummerization as we can get header sentences for all groups
  if(sentenceSet.getSetHeader(setIndex)==index)
  {
    console.log("this sentence is the header in set "+setIndex)
  }

  for(var termIndex in sentences[index].terms)
  {
    console.log(sentences[index].terms[termIndex].value+"   "+sentences[index].terms[termIndex].weight);
  }

  console.log("-----------------------------------------------------");
}
