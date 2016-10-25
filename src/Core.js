
class TermDocTextParser
{

  constructor()
  {

  }

  //Get Ecludian distance between two documtes
  GetDistance(sourceSentence,destSentence)
    {
    var totaldistance=0;

    var processedTokens={};

    var totaldistance=0;

    for(var key in sourceSentence.terms)
      {
        if(IsDefined(processedTokens[key]))
        {
          continue;
        }

        processedTokens[key]=true;

        var sourceSentTermFreq=IsDefined(sourceSentence.terms[key])?sourceSentence.terms[key].Weight:0;
        var destSentTermFreq=IsDefined(destSentence.terms[key])?destSentence.terms[key].Weight:0;

        totaldistance+=(Math.pow(sourceSentTermFreq-destSentTermFreq,2));
      }

    for(var key in destSentence.terms)
      {
        if(IsDefined(processedTokens[key]))
        {
          continue;
        }

        processedTokens[key]=true;

        var sourceSentTermFreq=IsDefined(sourceSentence.terms[key])?sourceSentence.terms[key].Weight:0;
        var destSentTermFreq=IsDefined(destSentence.terms[key])?destSentence.terms[key].Weight:0;

        totaldistance+=(Math.pow(sourceSentTermFreq-destSentTermFreq,2));
      }

      return Math.sqrt(totaldistance);
    };

  //Extract Documents class for pass quotes
   ExtractDocuments(quotes)
   {
     var docFrequencies={};

     var result=[];

     for(var index in quotes)
     {
     var document=new Document();

     document.Value=quotes[index];

     //Extract Tokens
     var tokens=this.ExtractTokens(quotes[index],document,docFrequencies);

     result.push(document);
     }

     return result;
   };

  //Extract sentences from a quotation
  ExtractSentences(quote)
  {
    var resultSentences=[];


    //Split quote with . and ? and ! to get sentences
    var sentences=quote.match(statmentDelimeters);
    var tmpSentence=null;
    var processedTokens=null;
    var isEndOfSentence=false;
    var isLastTokenNumber=false;
    var docFrequencies={};

    var tmpDocument=new Document();
    var lastToken=null;

    var counter=0;

    for(var sentenceIndex in sentences)
    {
      sentences[sentenceIndex]=sentences[sentenceIndex].trim();
      //Ignore if sentence is Empty or undefined
      if(!IsDefined(sentences[sentenceIndex]))
      {
        continue;
      }

      var isFirstTokenNumber=sentences[sentenceIndex].match(/^\d+\s+/)!=null;

      if(isEndOfSentence || (isLastTokenNumber && !isFirstTokenNumber))
      {
        tmpDocument=new Document();
        isEndOfSentence=true;
        isLastTokenNumber=false;
      }

      lastToken=this.ExtractTokens(sentences[sentenceIndex],tmpDocument,docFrequencies);

      isLastTokenNumber=IsTokenNumber(lastToken);

      if(!abbrevations[lastToken] && !isLastTokenNumber)
      {
        tmpDocument.SetIndex=counter++;
        resultSentences.push(tmpDocument);
        isEndOfSentence=true;
      }
      else {
        isEndOfSentence=false;
      }
    }

    return resultSentences;
  };


  //Extract tokens for passed documents
  ExtractTokens(quote,document,docFrequencies)
  {

    if(!IsDefined(document))
    {
      document=new Document();
    }

    //Extract Tokens
    var tokens= quote.split(tokenDelimeters);

    //Check whether first token is number
    var isFirstTokenNumber=IsTokenNumber(tokens[0]);
    //Create new statment in case last token isnot abbreviation
    //Or if last token  in previous statment is number and first token in the new statment isnot number

    document.Value+=quote;

    var lastToken=null;

    for(var tokenIndex in tokens)
    {
      var currentToken= lastToken = tokens[tokenIndex];


      //remove if stop word
      if(!IsDefined(currentToken) || stopWords[currentToken])
      {
        continue;
      }


      //stemming
      var stemValue=memoizingStemmer(currentToken).toLowerCase();

      //In case token not exist in statment before
      if(!IsDefined(document.terms[stemValue]))
      {
        document.terms[stemValue]=new Term();
        document.terms[stemValue].value=currentToken;
        document.terms[stemValue].Stem=stemValue;

        if(!IsDefined(docFrequencies[stemValue]))
        {
          document.terms[currentToken].DocumentFreq= docFrequencies[stemValue]= {value:0};
        }
        else if(!IsDefined(document.terms[stemValue].DocumentFreq)) {

          document.terms[stemValue].DocumentFreq=docFrequencies[stemValue];
        }

        docFrequencies[stemValue].value+=1;
      }
      document.terms[stemValue].Frequency++;

      document.length++;
    }

    return lastToken;
  }



  //Apply term frequency on matrix
  ApplyTf(documents,minTermWeight)
  {
    for(var documentIndex in documents)
    {
      var currentDocument=documents[documentIndex];

      for(var termIndex in currentDocument.terms)
      {
        var currentTerm=currentDocument.terms[termIndex];

        currentTerm.Weight=currentTerm.Frequency/currentDocument.length;


        if(currentTerm.Weight<minTermWeight)
        {
          delete currentDocument.terms[termIndex];
        }
      }
    }
  }


  //Apply term frquency and inverted document frequency on matrix
  ApplyTfIDf(sentences,minTermWeight)
  {
    var totalNumberOfDocs=sentences.length;

    for(var statmentIndex in sentences)
    {
      var currentDocument=sentences[statmentIndex];

      for(var termIndex in currentDocument.terms)
      {
        var currentTerm=currentDocument.terms[termIndex];

        currentTerm.Weight=((currentTerm.Frequency/currentDocument.length)*Math.log10(totalNumberOfDocs/currentTerm.DocumentFreq.value));

        if(currentTerm.Weight<minTermWeight)
        {
          delete currentDocument.terms[termIndex];
        }
      }
    }
  }


  //Extract disjoint set for passed documents
  ExtractDisJointSet(documents,simThrShold)
  {
  var documentSet=new DisJointSet();

  var calculatedDistances={};

  for(var i=0;i<documents.length-1;++i)
  {
    var totaldistance=0;
    var mainNodeParent;

    for(var s=i+1;s<documents.length;++s)
    {
      var curretNodeParent=-1;

      mainNodeParent=documentSet.find(i);
      curretNodeParent=documentSet.find(s);

      var distance=-1;

     if(!IsDefined(calculatedDistances[i]))
     {
       calculatedDistances[i]=0;
     }

     if(!IsDefined(calculatedDistances[s]))
     {
       calculatedDistances[s]=0;
     }
     distance=this.GetDistance(documents[i], documents[s]);

     var inSameSet=false;

      if(curretNodeParent!=mainNodeParent)
      {
        if(distance<=simThrShold)
            {
              mainNodeParent=documentSet.join(i,s);

              documents[i].SetIndex=mainNodeParent;
              documents[s].SetIndex=mainNodeParent;
              calculatedDistances[i]+=distance;
              calculatedDistances[s]+=distance;
              inSameSet=true;
            }
      }
      else {
        calculatedDistances[i]+=distance;
        calculatedDistances[s]+=distance;
        inSameSet=true;
      }

      if(inSameSet)
      {
         var biggerdistance=calculatedDistances[i]>calculatedDistances[s]?{index:i,value:calculatedDistances[i]}:{index:i,value:calculatedDistances[s]};
         documentSet.AssignSetHeader(mainNodeParent,biggerdistance.index,biggerdistance.value);
      }
    }

    }

    return {SetsHeaader:documentSet.SetsHeaader};
  }
}


function IsDefined(instance)
{
  return instance!="" && instance!=null && typeof instance!=undefined;
}



function IsTokenNumber(token)
{
  return token!=null && token.match(/^\d+$/)!=null;
}
