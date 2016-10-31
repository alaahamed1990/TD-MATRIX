
var TDMATRIX=function()
{

  //Get Ecludian distance between two documtes
  this.GetDistance=function(sourceSentence,destSentence)
    {

    if(!IsDefined(sourceSentence) || !IsDefined(destSentence) || !IsDefined(sourceSentence.terms) || !IsDefined(destSentence.terms))
    {
      return 0;
    }

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

        var sourceSentTermFreq=IsDefined(sourceSentence.terms[key])?sourceSentence.terms[key].weight:0;
        var destSentTermFreq=IsDefined(destSentence.terms[key])?destSentence.terms[key].weight:0;

        totaldistance+=(Math.pow(sourceSentTermFreq-destSentTermFreq,2));
      }

    for(var key in destSentence.terms)
      {
        if(IsDefined(processedTokens[key]))
        {
          continue;
        }

        processedTokens[key]=true;

        var sourceSentTermFreq=IsDefined(sourceSentence.terms[key])?sourceSentence.terms[key].weight:0;
        var destSentTermFreq=IsDefined(destSentence.terms[key])?destSentence.terms[key].weight:0;

        totaldistance+=(Math.pow(sourceSentTermFreq-destSentTermFreq,2));
      }

      return Math.sqrt(totaldistance);
    };

  //Extract Documents class for pass quotes
   this.ExtractDocuments=function(quotes)
   {
     if(!IsDefined(quotes))
     {
       return null;
     }

     if(quotes.length==0)
     {
       return [];
     }

     var docFrequencies={};

     var result=[];

     for(var index in quotes)
     {

    if(!IsNullOREmpty(quotes[index]))
    {
     var document=new Document();

     //Extract Tokens
     var tokens=this.ExtractNormlizedTokens(quotes[index],document,docFrequencies);



     result.push(document);
    }
     }

     return result;
   };

  //Extract sentences from a quotation
  this.ExtractSentences=function(quote)
  {
    if(IsNullOREmpty(quote))
    {
      return null;
    }

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


    for(var sentenceIndex in sentences)
    {
      //Ignore if sentence is Empty or undefined
      if(!IsDefined(sentences[sentenceIndex].trim()))
      {
        tmpDocument=null;
        continue;
      }


      this.ExtractNormlizedTokens(sentences[sentenceIndex],tmpDocument,docFrequencies);



      if(tmpDocument.isEndedProperly)
      {
        resultSentences.push(tmpDocument);

        tmpDocument=new Document();
      }
    }

    if(!IsNullOREmpty(tmpDocument.value))
    {
      resultSentences.push(tmpDocument);
    }

    return resultSentences;
  };


  //Extract tokens for passed documents
  //Return true if passed document terms was modified and false if not
  this.ExtractNormlizedTokens=function(quote,document,docFrequencies)
  {
    if(!IsDefined(document) || IsNullOREmpty(quote))
    {
      return false;
    }

    var isDocumentUpated=false;

    //Extract Tokens
    var tokens= quote.split(tokenDelimeters);

    //Check whether first token is number
    //Create new statment in case last token isnot abbreviation
    //Or if last token  in previous statment is number and first token in the new statment isnot number

    document.value+=quote;

    var lastToken=null;

    for(var tokenIndex in tokens)
    {
      var currentToken = tokens[tokenIndex];


      //remove if stop word
      if(!IsDefined(currentToken) || IsNullOREmpty(currentToken))
      {
        continue;
      }

      lastToken=currentToken;

      if(stopWords[currentToken])
      {
        continue;
      }



      isDocumentUpated=true;

      //stemming
      var stemValue=memoizingStemmer(currentToken).toLowerCase();

      //In case token not exist in statment before
      if(!IsDefined(document.terms[stemValue]))
      {
        document.terms[stemValue]=new Token();
        document.terms[stemValue].value=currentToken;
        document.terms[stemValue].stem=stemValue;

        if(!IsDefined(docFrequencies[stemValue]))
        {
          document.terms[stemValue].documentFreq= docFrequencies[stemValue]= {value:0};
        }
        else if(!IsDefined(document.terms[stemValue].documentFreq)) {

          document.terms[stemValue].documentFreq=docFrequencies[stemValue];
        }

        docFrequencies[stemValue].value+=1;
      }
      document.terms[stemValue].weight=++document.terms[stemValue].frequency;

      document.length++;
    }


    if(abbrevations[lastToken]) {
      document.isEndedProperly=false;
    }
    else {
      document.isEndedProperly=true;
    }
    return isDocumentUpated;
  }



  //Apply term frequency on matrix
  this.NormlizeTermsFrequency=function(documents,minTermWeight)
  {
    if(!IsDefined(documents) || minTermWeight<0 || documents.length==0)
    {
      return false;
    }

    for(var documentIndex in documents)
    {
      var currentDocument=documents[documentIndex];

      var docLength=currentDocument.length;

      for(var termIndex in currentDocument.terms)
      {
        var currentTerm=currentDocument.terms[termIndex];

        currentTerm.weight=currentTerm.frequency/docLength;


        if(currentTerm.weight<minTermWeight)
        {
          delete currentDocument.terms[termIndex];

          currentDocument.length--;
        }
      }
    }

    return true;
  }


  //Apply term frquency and inverted document frequency on matrix
  this.TFIDf=function(documents,minTermWeight)
  {
   if(!IsDefined(documents) || minTermWeight<0 || documents.length==0)
    {
        return false;
    }
    var totalNumberOfDocs=documents.length;

    for(var statmentIndex in documents)
    {
      var currentDocument=documents[statmentIndex];

      for(var termIndex in currentDocument.terms)
      {
        var currentTerm=currentDocument.terms[termIndex];

        currentTerm.weight=((currentTerm.frequency/currentDocument.length)*Math.log10(totalNumberOfDocs/currentTerm.documentFreq.value));

        if(currentTerm.weight<minTermWeight)
        {
          delete currentDocument.terms[termIndex];

          currentDocument.length--;
        }
      }
    }

    return true;
  }


  //Extract disjoint set for passed documents
  this.ExtractDisjointSet=function(documents,simThrShold)
  {

    if(!IsDefined(documents) || simThrShold<0 || documents.length==0)
     {
         return null;
     }

  var documentSet=new DisJointSet();

  var calculatedDistances={};

  if(documents.length==1)
  {
    documentSet.createset(0);
    return documentSet;
  }

  for(var i=0;i<documents.length-1;++i)
  {
    var totaldistance=0;
    var mainNodeParent;

    for(var s=i+1;s<documents.length;++s)
    {
      var curretNodeParent=-1;


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

     var mainNodeParent=documentSet.find(i);
     var currentNodeParent=documentSet.find(s);

     var inSameSet=false;

      if(mainNodeParent!=currentNodeParent)
      {
        if(distance<=simThrShold)
            {
              mainNodeParent=curretNodeParent=documentSet.join(i,s);

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

    return documentSet;
  }


}
